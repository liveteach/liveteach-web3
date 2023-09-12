variable "token" {
  description = "Your Linode API Personal Access Token. (required)"
  sensitive = true
}

variable "tags" {
  description = "Tags to apply to your cluster for organizational purposes. (optional)"
  type = list(string)
}

variable "email" {
  default = "paulf@vegascity.org"
}

variable "domain" {
  description = "Domain name"
}

variable "domain_id" {
  description = "ID of the domain in Linode"
}

variable "subdomain" {
  description = "Subdomain for the pages project"
}

# CloudFlare variables
variable "cloudflare_api_token" {
  description = "CloudFlare API token"
}

variable "cloudflare_account_id" {
  description = "CloudFlare Account ID"
}

variable "cloudflare_pages_project_name" {
  description = "Project name for the CloudFlare Pages setup"  
}

variable "production_branch" {
  description = "Branch used to determine whether this is a production deploy" 
  default = "master"
}