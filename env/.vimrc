
" General configuration
set nu
set number
set nowrap

set ci
set nocindent
set si
set ai
set ts=2
set sw=2

set nocompatible
set laststatus=2
set encoding=utf-8

" Do not set t_Co unless its necessary
" http://stackoverflow.com/questions/15375992/vim-difference-between-t-co-256-and-term-xterm-256color-in-conjunction-with-tmu/15378816#15378816
" set t_Co=256

syntax enable

" Load Vundle plugin manager
" @see https://github.com/gmarik/vundle
filetype off
set rtp+=~/.vim/bundle/vundle

" Required for Vundle
filetype plugin indent on

" Run :BundleInstall to install bundles


" Molokai (color-scheme)
let g:molokai_original = 1
let g:rehash256 = 1
set background=dark


" Powerline
let g:Powerline_symbols = 'fancy'


" Syntax checkers for syntastic
let g:syntastic_javascript_checkers = ['jslint']

""
" Disabled plugins
""

" call pathogen#infect('~/.vim/bundle')
" filetype off
" syntax on
" filetype plugin indent on

" set runtimepath+=$HOME/.vim/vim-javascript
" set runtimepath+=$HOME/.vim/vim-jst
" au BufNewFile,BufRead *.ejs set filetype=jst
" set cinkeys=0{,0},:,0#,!,!^F


