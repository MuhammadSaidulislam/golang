package setting

var ServerAddress = "https://golang-production-e245.up.railway.app"
var WorkerUrl = ""
var WorkerValidKey = ""

func EnableWorker() bool {
	return WorkerUrl != ""
}
