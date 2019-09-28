# proxy

A home assignment made just for you:
Following up on our discussion, I'd like you to write a simple API gateway server.
The purpose of this server is to be a proxy for all API requests and limit the rate of requests coming from a single user.

Few constraints:

- Please use Node.JS for the backend
- Try making this as clean and readable as you can.
- Try using as less third-party libs as possible.

The purpose of this server is to be a proxy/load balancer for API requests, that limit the rate of requests coming from a single user.
It should have two endpoints:
one that returns the user's IP address and the country name of the IP
second that provides metrics of the vendors (see details below).

please choose 2 vendors that provide free API for that and integrate to both.
(one vendor can be https://ipstack.com/, I'll let you choose the other :))

The server you'll write must have the following capabilities:

- Configurable limit to the number of API calls made for each vendor per hour (let's say 10 max per vendor)

If I set a limit of calls to Ipstack to be 10 max per hour - when a client will make the 11th call, your server wont call ipstack, but instead it’ll call to the second provider (load balancing / ‘least cost routing’). Think of it as if you had a quota of 10 api calls per hour per vendor and you mustn’t exceed the quota.

- naive cache for country name per the IP's B class
  if one API's rate limit has exceeded / the local rate limit has exceeded - fallback to the second service provider

if you get an api call from two clients in the same b class range, I expect only one call to the IPstack APi. Meaning you should somehow cache the results from the first api call.

- Measure the latency of each call to the vendor and save metrics (50th (avg.), 75th, 95th, and 99th percentiles) and save them so you could provide them back when calling the /metrics endpoint.
  Please upload it to a public/private GitHub account and provide a simple npm step to e2e test the API.

I want to know how the external vendor performs. Meaning what’s the vendor’s api latency. Think about what you need to save for every api call in order to be able to generate the metrics I asked for under the api examples I sent :)

The instructions are abstract on purpose, I want to see where you'll take it.
If anything's not clear / you'd like to get some clarification about something - please message me back :)

Have fun!
Or.

---

Example of the usage:
GET call to /getIPCountry will return the following:
{
"ip": "127.0.0.1",
"countryName": "Localhost",
"apiLatency": 300.10 //millis,
"vendor": "ipstack"
}

GET call to /metrics will return the following:
{
"ipstack": {
"percentile50": 300.10,
"percentile75": 450.10,
"percentile95": 480.10,
"percentile99": 600.10
},
"secondVendor": {
"percentile50": 300.10,
"percentile75": 450.10,
"percentile95": 480.10,
"percentile99": 600.10
}
}
