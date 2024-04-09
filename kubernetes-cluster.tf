provider "google" {
  project = "kubernetes-417516"
  region  = "us-central1"
  zone    = "us-central1-c"
  credentials = file("/home/viveksonani302/kubernetes-417516-2b27b8e6fdbf.json")
}

resource "google_container_cluster" "my_cluster" {
  name = "kubernetes-cluster"
  location = "us-central1"
  deletion_protection = false

  node_locations = ["us-central1-c"]

  node_config {
    machine_type = "e2-micro"
    disk_size_gb = 10
    disk_type    = "pd-standard"
    image_type   = "COS_CONTAINERD"
  }

  initial_node_count = 1
}
