using CouchSQLSync_v1.WebInterface;
using System;
using Topshelf;

namespace StresstestSQL
{
    class Program
    {
        static void Main(string[] args)
        {
            HostFactory.Run(x =>
            {
                x.Service<WebInterfaceService>(s =>
                {
                    s.ConstructUsing(name => new WebInterfaceService());
                    s.WhenStarted(tc => tc.Start());
                    s.WhenStopped(tc => tc.Stop());
                });
                x.RunAsLocalSystem();

                x.SetDescription("Web Api for JSON communication");
                x.SetDisplayName("Web Api");
                x.SetServiceName("Web Api");
            });

            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
        }
    }
}
