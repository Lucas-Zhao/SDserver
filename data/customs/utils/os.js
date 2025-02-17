const os = require("os");
const { exec } = require("child_process");


function getCPUUsageAsync() {
    return new Promise((resolve) => {
        const startMeasure = os.cpus();
        
        setTimeout(() => {
            const endMeasure = os.cpus();
            let idleDiff = 0, totalDiff = 0;

            startMeasure.forEach((start, i) => {
                const end = endMeasure[i];
                const idle = end.times.idle - start.times.idle;
                const total = Object.keys(end.times).reduce((acc, key) => acc + (end.times[key] - start.times[key]), 0);

                idleDiff += idle;
                totalDiff += total;
            });

            const usage = 100 - (idleDiff / totalDiff * 100);
            resolve(usage.toFixed(2) + "%");
        }, 1000); // Measure over 1 second
    });
}

function getRAMUsage() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;

    return {
        total: (total / 1024 / 1024 / 1024).toFixed(2) + " GB",
        used: (used / 1024 / 1024 / 1024).toFixed(2) + " GB",
        free: (free / 1024 / 1024 / 1024).toFixed(2) + " GB",
        usage: ((used / total) * 100).toFixed(2) + "%"
    };
}


function getDiskUsageAsync() {
    return new Promise((resolve, reject) => {
        exec("df -k /", (error, stdout, stderr) => {
            if (error || stderr) return reject(error || stderr);
            
            const lines = stdout.split("\n");
            const tokens = lines[1].split(/\s+/);

            const total = parseInt(tokens[1]) * 1024; // Convert KB to bytes
            const used = parseInt(tokens[2]) * 1024;
            const free = parseInt(tokens[3]) * 1024;
            const usage = ((used / total) * 100).toFixed(2) + "%";

            resolve({
                total: (total / 1024 / 1024 / 1024).toFixed(2) + " GB",
                used: (used / 1024 / 1024 / 1024).toFixed(2) + " GB",
                free: (free / 1024 / 1024 / 1024).toFixed(2) + " GB",
                usage
            });
        });
    });
}

async function getSystemStatsAsync() {
    const cpuUsage = await getCPUUsageAsync();
    const ramUsage = getRAMUsage();
  //  const diskUsage = await getDiskUsageAsync();

    return { cpuUsage, ramUsage };
}



module.exports = {getCPUUsageAsync, getRAMUsage, getDiskUsageAsync, getSystemStatsAsync}
