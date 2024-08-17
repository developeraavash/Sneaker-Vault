import { CronJob } from "cron";

// this job sets the order status to processessing
const setOrderStatusToProcessing = new CronJob("", () => {});

// this job sets the order status to
const setOrderStatusToDelivered = new CronJob("", () => {});
