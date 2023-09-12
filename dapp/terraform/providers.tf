terraform {
  required_providers {
    linode = {
      source  = "linode/linode"
      version = "1.29.4"
    }
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "3.25.0"
    }
  }
}

provider "linode" {
  token = var.token
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
