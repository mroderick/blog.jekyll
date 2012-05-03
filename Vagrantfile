Vagrant::Config.run do |config|
  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "base"

  # Force gui to resolve some issues where the VM becomes unreachable
  config.vm.boot_mode = :gui

  # Fix for Vagrant not catching up with VM that started successfully: https://github.com/mitchellh/vagrant/issues/455
  config.ssh.max_tries = 150
  
  # Forward guest port 4000 to host port 4000 and name the mapping "jekyll"
  config.vm.forward_port(4000, 4000)
  config.vm.forward_port(80, 8080)
    
  # Enable and configure the chef solo provisioner
  config.vm.provision :chef_solo do |chef|
    
    chef.json = {
      "hostname" => "roderick.dk.local"
    }
    
    # chef.log_level = "debug"
    chef.add_recipe "roderick_dk"
  end
end