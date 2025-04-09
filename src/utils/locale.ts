export function transferUrl(path:string, locale:any){
    if(path.startsWith('/')){
        return `/${locale}${path}`;
    }
    return `/${locale}/${path}`;
}