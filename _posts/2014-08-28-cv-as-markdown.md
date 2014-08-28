---
title: cv as markdown
layout: post
---

# cv as markdown

For a while I've had a [Bootstrap](http://getbootstrap.com) based cv on this site. While it showed that I am capable of writing HTML, it was a pain to edit. As most people will attest to, keeping your cv is one of their least favourite tasks. Adding HTML doesn't make it any more enjoyable.

I wanted to switch to having the source of my cv in [Markdown](http://daringfireball.net/projects/markdown/) for a number of reasons:

* It's as easy as writing an email
* It's familiar, I use it every day for
	* [pull requests on GitHub](https://help.github.com/articles/creating-a-pull-request)
	* writing documentation for the software I work on
* I can paste the source document into a plain text email, and everyone can immediately read it
* I can easily generate a binary formats for recruiters that prefer that
* It's easy to read diffs in git

It took me a bit to do all the editing from HTML to Markdown, but now my [cv is available as Markdown](/cv/cv.md). From now on, updating it will be as easy as all the other editing I do on a daily basis.

## Converting Markdown to PDF

Some recruiters request a PDF (or other binary) version, so I'll have to generate one, and [Jekyll](http://jekyllrb.com) (which I use for building this site) isn't going to do it for me.

Enter [pandoc](http://johnmacfarlane.net/pandoc/index.html), "a universal document converter".

On OSX, installing it is fairly easy with [Homebrew](http://brew.sh)

```
$ brew install pandoc
```

Before you pat yourself on the shoulder for a job well done, you'll still need a working TeX distribution on your machine so pandoc can create PDFs. I ended up using the [BasicTeX distribution](http://www.tug.org/mactex/morepackages.html) of MacTeX.

Installation was as easy as installing any regular application on OSX, and now I can generate the PDF in a single command

```
$ pandoc cv/cv.md -o cv/cv.pdf
```

The [PDF version of my cv](/cv/cv.pdf) is now available :-)

Sure, it's not the sexiest PDF the world has seen, but I am optimising for authoring pleasure and for making it easy to read.

## Build on deploy

In the normal Jekyll workflow, Jekyll builds your site out of the source files and pours them into a `_site` folder (removing anything that was already there). Jekyll does not convert Markdown to PDF, so that'll have to happen after the site is generated and before deploy.

I use a [Rakefile](http://en.wikipedia.org/wiki/Rake_(software)) to build and deploy this site, so with a few updates, `rake` can now be used for generating a PDF version of the cv.

The Rakefile now looks like this

```ruby
desc 'Build CV to PDF with pandoc'
task :cv  => [:build] do
	sh 'pandoc _site/cv/cv.md -o _site/cv/cv.pdf'
end

desc 'Build site with Jekyll'
task :build do  
  sh 'jekyll build' 
end

desc 'Build and deploy'
task :deploy => [:build, :cv] do
  sh 'rsync -a --delete --delay-updates --progress -e ssh _site/ morgan@roderick.dk:/dana/data/www.roderick.dk/docs/'
end

def jekyll(opts = '')
  sh 'rm -rf _site'
  sh 'jekyll ' + opts
end
```

The source of this website is [available on GitHub](https://github.com/mroderick/blog.jekyll), some of it has an MIT license.
