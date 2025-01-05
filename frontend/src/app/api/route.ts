export async function GET(){
    const res = await fetch('http://backend:8000');
    return res;
}