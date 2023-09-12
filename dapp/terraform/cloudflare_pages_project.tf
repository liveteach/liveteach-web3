resource "cloudflare_pages_project" "pages_project" {
  account_id        = var.cloudflare_account_id
  name              = var.cloudflare_pages_project_name
  production_branch = var.production_branch

  # Defining the defaults for these, otherwise they show up in the plan stage
  deployment_configs {
    preview {
      compatibility_date        = "2022-10-24"
      compatibility_flags       = []
      d1_databases              = {}
      durable_object_namespaces = {}
      environment_variables     = {}
      kv_namespaces             = {}
      r2_buckets                = {}
    }
    production {
      compatibility_date        = "2022-10-24"
      compatibility_flags       = []
      d1_databases              = {}
      durable_object_namespaces = {}
      environment_variables     = {}
      kv_namespaces             = {}
      r2_buckets                = {}
    }
  }  
}

resource "cloudflare_pages_domain" "pages_domain" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.pages_project.name
  domain       = "${var.subdomain}.${var.domain}"
}

output "cloudflare_pages_project_name" {
  value = cloudflare_pages_project.pages_project.name
}

output "cloudflare_pages_project_subdomain" {
  value = cloudflare_pages_project.pages_project.subdomain
}