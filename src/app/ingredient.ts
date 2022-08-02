export class ingredient {
    name: string[] = [];
    aisle: string = "";
    variations: string[] = [];
    plural?: string;

    constructor(aisle: string, obj: object) {
        this.aisle = aisle;
        if (typeof obj == 'string') {
            this.name.push((<string>obj).replace(" + ", " "));
            return;
        }
        if (Array.isArray(obj)) {
            this.name = obj.map(x => x.replace(" + ", " "));
            return;
        }
        type ObjectKey = keyof typeof obj;
        if (obj.hasOwnProperty('name')) {
            const myVar = 'name' as ObjectKey;
            this.name.push((<string>obj[myVar]).replace(" + ", " "));
        }
        if (obj.hasOwnProperty('variations')) {
            const myVar = 'variations' as ObjectKey;
            this.variations = (<string[]>obj[myVar])
                .filter(x => typeof x == 'string')
                .map(x => x.replace(" + ", " "));
        }
        if (obj.hasOwnProperty('plural')) {
            const myVar = 'plural' as ObjectKey;
            this.plural = (<string>obj[myVar]).replace(" + ", " ");
        }
    }


}