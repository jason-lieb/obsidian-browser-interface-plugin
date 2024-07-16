{
  inputs = {
    nixpkgs-23-11.url = "github:nixos/nixpkgs/nixos-23.11";
    freckle.url = "git+ssh://git@github.com/freckle/flakes?dir=main";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    inputs:
    inputs.flake-utils.lib.eachDefaultSystem (
      system:
      let
        nixpkgsArgs = {
          inherit system;
          config = { };
        };
        nixpkgs-23-11 = import inputs.nixpkgs-23-11 nixpkgsArgs;
        freckle = inputs.freckle.packages.${system};
      in
      rec {
        packages = rec {
          nodejs = freckle.nodejs-18-19-1;
          prettier = freckle.prettier-default;
          typescript = nixpkgs-23-11.typescript;
        };
        devShells.default = nixpkgs-23-11.mkShell {
          name = "obisidian-browser-interface-extension";
          buildInputs = with packages; [
            nodejs
            prettier
            typescript
          ];
        };
      }
    );

  nixConfig = {
    extra-substituters = [
      "https://freckle.cachix.org"
      "https://freckle-private.cachix.org"
    ];
    extra-trusted-public-keys = [
      "freckle.cachix.org-1:WnI1pZdwLf2vnP9Fx7OGbVSREqqi4HM2OhNjYmZ7odo="
      "freckle-private.cachix.org-1:zbTfpeeq5YBCPOjheu0gLyVPVeM6K2dc1e8ei8fE0AI="
    ];
  };
}
