# Add binaries into the path
PATH=~/.dotfiles/bin:$PATH
export PATH

# Source all files in ~/.dotfiles/source/
function src() {
  local file
  if [[ "$1" ]]; then
    source "$HOME/.dotfiles/source/$1.sh"
  else
    for file in ~/.dotfiles/source/*; do
      source "$file"
    done
    if [[ -d "~/.dotfiles/private-source" ]]; then
      for file in ~/.dotfiles/private-source/*; do
        source "$file"
      done
    fi
  fi
}

# Run dotfiles script, then source.
function dotfiles() {
  ~/.dotfiles/bin/dotfiles "$@" && src
}

src

# added by travis gem
[ -f /Users/lonnen/.travis/travis.sh ] && source /Users/lonnen/.travis/travis.sh
