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

# install specific liquid gem that won't break on the Liquid highlighter
# https://github.com/mojombo/jekyll/issues/422
rvm_gem "liquid" do
  version "2.2.2"
  action  :install
end

rvm_gem "jekyll" do
  ruby_string "ruby-1.9.2-p290"
  action      :install
end

require_recipe "python"

easy_install_package "Pygments" do
  # version "1.8d"
  action :install
end

require_recipe "nginx::default"
