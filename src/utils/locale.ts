import { useParams } from "next/navigation";

export function transferUrl(path:string){
    const {locale} = useParams();
    console.log(locale);
    return `/${locale}/${path}`;
}