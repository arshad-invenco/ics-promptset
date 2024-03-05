import { Dropdown, Modal } from "react-bootstrap";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import SortIcon from "@mui/icons-material/Sort";

import "./mediaModal.scss";
import {
  Asset,
  AssetParams,
  Order,
  Size,
} from "../../../../models/media.modal";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchAssets } from "../../../../redux/thunks/mediaThunk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import {
  selectAssetLoading,
  selectAssets,
} from "../../../../redux/selectors/mediaSelectors";
import { MEDIA_PLACEHOLDER, ORDERS, SIZES } from "../../../../constants/media";
import { debounce } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Loader from "../../../common/loader/loader";

interface ModalProps {
  hide: () => void;
  onAssetSelection: (asset: Asset) => void;
  type: string;
}

function MediaModal({ hide, onAssetSelection, type }: ModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const assets = useSelector(selectAssets);
  const isLoading = useSelector(selectAssetLoading);

  const sizeDropdownRef = useRef<HTMLDivElement>(null);
  const orderDropdownRef = useRef<HTMLDivElement>(null);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(ORDERS[0].name);
  const [orderDropdownStatus, setOrderDropdownStatus] = useState(false);
  const [sizeDropdownStatus, setSizeDropdownStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [replace, setReplace] = useState<boolean>(true);
  const [queryParams, setQueryParams] = useState<AssetParams>({
    order: "uploaded",
    pageIndex: 0,
    pageSize: 20,
    type: type.toUpperCase(),
    ...(type === "video" && { videoExtension: ".webm",  }),
  });
  const [sizeQueryParams, setSizeQueryParams] =
    useState<AssetParams>(queryParams);
  const [previousParams, setPreviousParams] = useState<AssetParams>({
    pageIndex: 0,
    pageSize: 20,
    type: type.toUpperCase(),
  });

  //Dropdown Handlers
  const handleClose = () => {
    if (sizeDropdownStatus) setQueryParams(sizeQueryParams);
    setSizeDropdownStatus(!sizeDropdownStatus);
  };

  const handleSizeSelection = (size: Size) => {
    setReplace(true);
    const { maxHeight, maxWidth, minHeight, minWidth, pageIndex, ...rest } =
      queryParams;

    if (size.name !== selectedSize) {
      setSelectedSize(size.name);

      const updatedQueryParams: AssetParams = {
        ...rest,
        pageIndex: 0,
        minHeight: size.minHeight,
        minWidth: size.minWidth,
        ...(size.maxHeight && { maxHeight: size.maxHeight }),
        ...(size.maxWidth && { maxWidth: size.maxWidth }),
      };

      setSizeQueryParams(updatedQueryParams);
    } else {
      setSelectedSize("");
      setSizeQueryParams({ ...rest, pageIndex: 0 });
    }
  };

  const handleOrderSelection = (order: Order) => {
    setReplace(true);
    setSelectedOrder(order.name);
    setQueryParams({ ...queryParams, order: order.value, pageIndex: 0 });
    setSizeQueryParams({
      ...sizeQueryParams,
      order: order.value,
      pageIndex: 0,
    });
    setOrderDropdownStatus(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const isOutsideSizeDropdown =
      sizeDropdownRef.current &&
      !sizeDropdownRef.current.contains(event.target as Node);
    const isOutsideOrderDropdown =
      orderDropdownRef.current &&
      !orderDropdownRef.current.contains(event.target as Node);

    if (isOutsideSizeDropdown) {
      setQueryParams(sizeQueryParams);
      setSizeDropdownStatus(false);
    }
    if (isOutsideOrderDropdown) {
      setOrderDropdownStatus(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [queryParams, sizeQueryParams]);

  const renderDropdownItems = (
    items: any,
    selectedItem: any,
    handleSelection: any
  ) => {
    return items.map((item: any) => (
      <Dropdown.Item
        className={selectedItem === item.name ? "selected-option" : ""}
        key={item.name}
        onClick={() => handleSelection(item)}
      >
        {item.name}
        {selectedItem === item.name && (
          <i className="fa-solid fa-circle-check"></i>
        )}
      </Dropdown.Item>
    ));
  };

  //Handle Search

  const debouncedSearchTerm = useCallback(
    debounce((value) => {
      !replace && setReplace(true);
      if (value !== "") {
        setQueryParams({ ...queryParams, name: value, pageIndex: 0 });
      } else {
        const { name, ...rest } = queryParams;
        setQueryParams({ ...rest, pageIndex: 0 });
      }
    }, 1000),
    []
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.trim());
    debouncedSearchTerm(event.target.value.trim());
  };

  const clearSearch = () => {
    setSearchTerm("");
    const { name, ...rest } = queryParams;
    setQueryParams({ ...rest, pageIndex: 0 });
  };

  //Handle Media
  const imageSrc = (media: Asset) => {
    const { thumbnailUrl, sourceUrl, properties, name } = media;
    const mimeType = properties?.mimeType || "";

    if (thumbnailUrl && !mimeType.includes("gif")) {
      return thumbnailUrl;
    }

    if (!mimeType.includes("webm")) {
      return sourceUrl;
    }
    return name.includes("g6") ? MEDIA_PLACEHOLDER.g6 : MEDIA_PLACEHOLDER.g7;
  };

  const onImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = event.target as HTMLInputElement;
    target.src = MEDIA_PLACEHOLDER.error;
  };

  const handleAssetSelection = (asset: Asset) => () => {
    setSelectedAsset(asset);
  };

  const handleScroll = (event: React.UIEvent) => {
    const target = event.target as HTMLDivElement;
    const { pageIndex } = queryParams;

    if (
      target.offsetHeight + target.scrollTop + 1 >= target.scrollHeight &&
      pageIndex * 20 <= assets?.resultsMetadata?.totalResults
    ) {
      setReplace(false);
      setQueryParams({
        ...queryParams,
        pageIndex: queryParams.pageIndex + 1,
      });
    }
  };

  useEffect(() => {
    setReplace(true);
  }, [selectedOrder, selectedSize, searchTerm]);

  useEffect(() => {
    if (JSON.stringify(queryParams) !== JSON.stringify(previousParams)) {
      if (replace) {
        queryParams.pageIndex = 0;
      }
      setPreviousParams(queryParams);
      dispatch(fetchAssets({ queryParams, replace: replace }));
    }
  }, [queryParams, dispatch, previousParams]);

  const renderImages = () => {
    return (
      <div className="media-column">
        {assets?.results &&
          assets.results.map((asset, index) => (
            <div
              key={index}
              className={
                selectedAsset?.id === asset.id
                  ? "img-container selected-img"
                  : "img-container"
              }
              onClick={handleAssetSelection(asset)}
            >
              {
                <>
                  <img
                    key={index}
                    src={imageSrc(asset)}
                    alt={asset.name}
                    onError={onImageError}
                  />
                  {selectedAsset?.id === asset.id && (
                    <>
                      <div className="check"></div>
                      <CheckCircleIcon
                        className="check-icon"
                        fontSize="large"
                      />
                    </>
                  )}
                </>
              }
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="media" onClick={(e)=>e.stopPropagation()}>
      <Modal.Header>
        <div className="navbar-header">
          <div className="name">
            {ORDERS.find((order) => order.name === selectedOrder)?.title}
          </div>
          {assets?.resultsMetadata &&
            assets.resultsMetadata.totalResults !== 0 && (
              <div className="total">
                {assets?.resultsMetadata?.totalResults} items
              </div>
            )}
        </div>
        <div className="navbar-body">
          <Dropdown show={orderDropdownStatus} ref={orderDropdownRef}>
            <Dropdown.Toggle
              onClick={() => setOrderDropdownStatus(!orderDropdownStatus)}
              className={!orderDropdownStatus ? "blur-btn" : "focus-btn"}
            >
              <SortByAlphaIcon fontSize="large" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <div className="filter-menu">
                <div className="group-type">Sort By:</div>
                {renderDropdownItems(
                  ORDERS,
                  selectedOrder,
                  handleOrderSelection
                )}
              </div>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown show={sizeDropdownStatus} ref={sizeDropdownRef}>
            <Dropdown.Toggle
              onClick={() => handleClose()}
              className={!sizeDropdownStatus ? "blur-btn" : "focus-btn"}
            >
              <SortIcon fontSize="large" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <div className="filter-menu">
                <div className="group-type">Size</div>
                {renderDropdownItems(SIZES, selectedSize, handleSizeSelection)}
              </div>
            </Dropdown.Menu>
          </Dropdown>
          <div className="media-input">
            <input
              className="ics-input"
              placeholder="Search"
              onChange={handleInputChange}
              value={searchTerm}
            ></input>
            {searchTerm && (
              <button
                className="clear-button"
                onClick={() => {
                  clearSearch();
                }}
              >
                <i className="fa-solid fa-xmark clear-icon"></i>
              </button>
            )}
          </div>
        </div>
      </Modal.Header>
      <Modal.Body onScroll={handleScroll}>
        <div className="media-row">{renderImages()}</div>
        {isLoading && <Loader />}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-default" onClick={hide}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          disabled={!selectedAsset}
          onClick={() => {
            if (selectedAsset) onAssetSelection(selectedAsset);
          }}
        >
          Confirm
        </button>
      </Modal.Footer>
    </div>
  );
}

export default MediaModal;
