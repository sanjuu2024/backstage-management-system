export const getTime = ():string =>{
    const h = new Date().getHours();
    if (h < 11) return '早上';
    else if (h < 14) return '中午';
    else if (h < 18) return '下午';
    else return '晚上';
}