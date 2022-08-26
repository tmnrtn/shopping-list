export interface SearchURL {
    provider:string;
    url:string;
}

export  const URLS : SearchURL[] = [
    {provider : 'None', url: ''},
 {provider : 'Waitrose', url: 'https://www.waitrose.com/ecom/shop/search?&searchTerm='},
 {provider : 'Tesco', url: 'https://www.tesco.com/groceries/en-GB/search?query='}
]