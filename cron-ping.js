const cron = require('node-cron');

// ...

// Schedule tasks to be run on the server.
cron.schedule('* * * * *', function() {
    console.log('running a task every minute');
});

cron.schedule('59 23 * * *', function() {
    console.log('running a task every 23:59');
});

/*
crontab syntax
* * * * * *
| | | | | |
| | | | | day of week
| | | | month
| | | day of month
| | hour
| minute
second ( optional )
*/ 