using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Pager.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
        public ActionResult Rows(int id)
        {
            return PartialView("_Rows", id);
        }
        public ActionResult Index()
        {
            return View();
        }

    }
}
