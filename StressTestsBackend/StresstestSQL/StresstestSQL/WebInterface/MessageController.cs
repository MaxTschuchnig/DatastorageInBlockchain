using Newtonsoft.Json;
using StresstestSQL.Database.Data;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Cors;

namespace CouchSQLSync_v1.WebInterface
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api")]
    [AllowAnonymous]
    public class MessageController : ApiController
    {
        [HttpGet]
        [Route("test")]
        public HttpResponseMessage CheckConnection()
        {
            return this.GetJsonResponse(HttpStatusCode.OK, new StringContent(JsonConvert.SerializeObject("Ok")));
        }

        [HttpPut]
        [Route("AddItem")]
        public HttpResponseMessage Add([FromBody]object toAdd)
        {
            Console.WriteLine(JsonConvert.SerializeObject(toAdd));

            return this.GetJsonResponse(HttpStatusCode.OK, new StringContent(JsonConvert.SerializeObject("Ok")));
        }

        [HttpPut]
        [Route("BatchAddItem")]
        public HttpResponseMessage AddBatch([FromBody]object toAdd)
        {
            Console.WriteLine(JsonConvert.SerializeObject(toAdd));

            return this.GetJsonResponse(HttpStatusCode.OK, new StringContent(JsonConvert.SerializeObject("Ok")));
        }

        /// <summary>
        /// Generates a basic HTTPResonseMessage in json format.
        /// </summary>
        /// <param name="code">Status Code</param>
        /// <param name="content">Content as StringContent</param>
        /// <returns>HttpResponseMessage in json format with status code = code and content = content</returns>
        private HttpResponseMessage GetJsonResponse(HttpStatusCode code, StringContent content)
        {
            var response = new HttpResponseMessage(code);

            if (response.Content == null)
            {
                response.Content = content;
            }
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            return response;
        }
    }
}