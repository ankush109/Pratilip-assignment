import client from "prom-client";

export const activeRequestsGauge = new client.Gauge({
    name: 'active_requests',
    help: 'Number of active requests'
});
export const httpdurationMiroseconds =  new client.Histogram({
    name:"http_request_duration",
    help:"duration of HTTP request in ms",
    labelNames:["method","route","code"],
    buckets:[0.1,5,15,50,100,300,500,1000,3000,5000]
})
export function httpMicrosecond(req:any,res:any,next:any){
    const startTime = Date.now()
    console.log("in middleware..")
    res.on("finish",()=>{
        const endDate = Date.now()
        httpdurationMiroseconds.observe({
            method:req.method,
            route:req.route,
            code:res.statusCode
        },endDate-startTime)
    })
    next()
}