---
title: Creating Sitemaps with Comatose CMS
layout: post
topics: rails comatose sitemap
disable_comments: true
---

For some time now, I've been using [Comatose CMS](http://github.com/darthapo/comatose/tree/master) for client sites. It is quite possible the smallest Rails based CMS, having only the features you need for most sites and flexible enough to allow you to extend it if you need to. 

Whenever you're doing content publishing, you should make it as easy as possible for search engines to find and catalog our content. In this post I will show you how you can create a simple [Sitemap](http://www.sitemaps.org) from a Comatose CMS.

Here is how I have created Sitemaps from Comatose. The code samples have been extracted from client projects.

## Routing

First we will map `/sitemap.xml` to an action on controller.

{% highlight ruby %}
# routes.rb
ActionController::Routing::Routes.draw do |map|
 	map.connect "sitemap.xml", :controller => "info", :action => "sitemap"
end
{% endhighlight %}

## Action

In the action of the controller, we will build a collection of pages to include in the sitemap. By not iterating over the `children` collection of each page, we avoid creating numerous calls to the database. Instead we will just use an SQL based find to create our collection.

{% highlight ruby %}
# info_controller.rb ( or other public controller )
def sitemap
	respond_to do |format|
   format.xml do
			@website_url = 'http://www.hamsterboy.dk'
			@pages = ComatosePage.find(:all, :conditions => "full_path not like ''")
			render :action => 'sitemap', :layout => false
		end
	end
end
{% endhighlight %}

## Rendering sitemap

After finding the pages, all we need to do is to render them as a sitemap.

As you will note, the frontpage of the site gets special treatment. It's lastmod attribute is set to the current time (as you probably have content from other sources than your Comatose CMS) and more importantly, we're setting a *different priority* from all the other pages. Search engines need to know which content is more important on your site, and Google Webmaster Tools will give you warnings if all your pages have the same priority.

{% highlight ruby %}
# sitemap.rxml
xml.instruct! 
xml.urlset "xmlns" => "http://www.sitemaps.org/schemas/sitemap/0.9" do

	# create an entry for the frontpage
	xml.url do
	  xml.loc         "#{@website_url}/"
	  xml.lastmod     w3c_date( Time.now )
	  xml.changefreq  "weekly"
	  xml.priority    1.0
	end

	# create an entry for each of the pages from the find method
 	@pages.each do |page|
		xml.url do
			xml.loc         "#{@website_url}/#{page.full_path}"
			xml.lastmod     w3c_date(page.updated_on)
			xml.changefreq  "weekly"
			xml.priority    0.9
		end
	end
end
{% endhighlight %}

## Formatting dates as W3C dates

Almost there... to avoid repetition, I've created a little helper for formatting the dates for sitemaps in the [W3C Datetime](http://www.w3.org/TR/NOTE-datetime) format.

{% highlight ruby %}
module SitemapHelper
	def w3c_date(date)
		date.utc.strftime("%Y-%m-%dT%H:%M:%S+00:00")
	end
end
{% endhighlight %}

## Final result

Testing the above code on a virgin Comatose database at <http://localhost:3000/sitemap.xml>, you should see something like this

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://example.com/</loc>
    <lastmod>2009-03-16T08:41:23+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
{% endhighlight %}

That's it, your site is now a little easier for search engines to catalog.

## Where do I go from here?

Well, that is entirely up to you. If you have any other kind of content that you're publishing on your site, it should not be too hard to extend the sitemap to include that as well. 

Please do note that this post only describes Sitemap in it's simplest form, there are limitations as your sitemaps grows, and there are options to create more specialized sitemaps as well.

### Resources

* [Comatose CMS](http://github.com/darthapo/comatose/tree/master)
* [Sitemap](http://www.sitemaps.org/)
* [Google Webmaster Tools](http://www.google.com/webmasters/tools/)