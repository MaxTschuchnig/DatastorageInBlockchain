using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace StresstestSQL.Database.Data
{
    public class Ticket
    {
        [Key]
        public int Id { get; set; }

        string task { get; set; }
        string technician { get; set; }
        string due_date { get; set; }
    }
}
