export interface Order{
    id?: number;
    direction_init?: string;
    comment_init?: string;
    location_init?:string;
    direction_final?: string;
    comment_final?: string;
    location_final?:string;
    status?: string;
    payment?: string;
    create_at?:Date;
}