# apt is needed for most recipes
require_recipe "apt"
require_recipe "build-essential"

directory "/etc/profile.d" do
    action :create
    owner "root"
    group "root"
    mode 0755
  end

# make sure that Ruby interprets strings as UTF-8 by default, which makes 1.9 not generate exceptions for
# Scandinavian characters in UTF-8 strings
cookbook_file "/etc/profile.d/set_utf8_default_ruby_string.sh" do
    source "set_utf8_default_ruby_string.sh"
    mode 0644
    owner "root"
    group "root"
end

require_recipe "rvm::vagrant"
require_recipe "rvm::system"

rvm_gem "jekyll" do
  ruby_string "ruby-1.9.2-p290"
  action      :install
end

require_recipe "python"

easy_install_package "Pygments" do
  # version "1.8d"
  action :install
end

# apache2
require_recipe "apache2"
require_recipe "apache2::mod_deflate"
require_recipe "apache2::mod_rewrite"
require_recipe "apache2::mod_expires"
require_recipe "apache2::mod_setenvif"
require_recipe "apache2::mod_headers"

# configure sites
execute "disable-default-site" do
  command "sudo a2dissite default"
  notifies :reload, resources(:service => "apache2"), :delayed
end

web_app "roderick_dk" do
  template "roderick_dk.conf.erb"
  notifies :reload, resources(:service => "apache2"), :delayed
  docroot "#{node[:vagrant][:directory]}/site/_site"
end