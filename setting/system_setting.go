package setting

var ServerAddress = "https://golang-production-9393.up.railway.app"
var WorkerUrl = ""
var WorkerValidKey = ""

func EnableWorker() bool {
	return WorkerUrl != ""
}
