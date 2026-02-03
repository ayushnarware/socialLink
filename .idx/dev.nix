{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
  ];
  idx.extensions = [
    
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
"dev"
          "--"
          "--port"
          "3001"
          "--hostname"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}