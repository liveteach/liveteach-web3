resource "linode_domain_record" "linode_cname" {
    domain_id = var.domain_id
    name = var.subdomain
    record_type = "CNAME"
    target = cloudflare_pages_project.pages_project.subdomain
}

output "linode_cname" {
    value = linode_domain_record.linode_cname.name
}