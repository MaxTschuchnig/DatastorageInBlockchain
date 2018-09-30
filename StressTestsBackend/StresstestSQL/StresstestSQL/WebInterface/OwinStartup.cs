using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace CouchSQLSync_v1.WebInterface
{
    class OwinStartup
    {
        /// <summary>
        /// Configuration for Web Interface. Configs serialization to json and xml. Init Web Interface with configuration
        /// </summary>
        /// <param name="builder">Builds Owin Web Interface</param>
        public void Configuration(IAppBuilder builder)
        {
            var config = new HttpConfiguration();
            config.MapHttpAttributeRoutes();

            config.Formatters.XmlFormatter.SupportedMediaTypes.Clear();
            config.EnableCors();

            var jsonSettings = new JsonSerializerSettings();
            jsonSettings.TypeNameHandling = TypeNameHandling.None;
            jsonSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            jsonSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            config.Formatters.JsonFormatter.SerializerSettings = jsonSettings;
            builder.UseWebApi(config);
            config.EnsureInitialized();
        }
    }
}
