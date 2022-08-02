export interface Grocery {
    uid: string;
    recipe_uid?: any;
    name: string;
    order_flag: number;
    purchased: boolean;
    aisle: string;
    ingredient: string;
    recipe?: any;
    instruction: string;
    quantity: string;
    separate: boolean;
    aisle_uid: string;
    list_uid: string;
    deleted: boolean;
}