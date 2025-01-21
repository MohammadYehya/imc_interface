
export async function GET(){
    const res = [{camid:"CAMERA1", condition:"NG"}, {camid:"CAMERA2", condition:"NG"}, {camid:"CAMERA3", condition:"OK"}, {camid:"CAMERA4", condition:"NG"}]
    return Response.json(res);
}