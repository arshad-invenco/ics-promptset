
export interface LastModifiedInterface{
    version: string;
    modified: string;
    modifiedBy: {
        id: string;
        name: string;
        email: string;
    };
}