# Understand Fetch Example

The repository is created to share the example code from my post [Understanding Fetch 'cache' with VanilaJS and Next.js](https://dev.to/lico/understanding-fetch-cache-with-vanilajs-and-nextjs-5g81) on Dev.to.

---

# Post

When I implemented API requests on the client side, I used the `axios` library. Using the library looked more beneficial to me over `fetch`. `react-query` allowed me to utilize `cache` in an easy way. 

I didn't really try Next.js 13 and I recently read about the `cache` of `fetch` on [the doc](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating), and it was a bit confusing. It says the "'force-cache' is the default, and can be omitted". Although I didn't often use the `fetch` function, I don't think the `fetch` call uses `cache` by default. It later turns out this is about Next.js. However, somehow it makes me get doubt what I know about `fetch`.

In [MDN:Request: cache property](https://developer.mozilla.org/en-US/docs/Web/API/Request/cache), it says "If there is a match and it is fresh, it will be returned from the cache." by default when using `fetch`. That was what I didn't know. I wanted to see the result depending on a cache, but there are only theory parts out there about it. I ended up deciding to do the experiment by myself and share it on my blog thinking that there may be some people like me.

---

### Overview
- [Cache](#cache)
- [Fetch Cache with VanilaJS](#cache-with-vanilajs)
  - VanilaJS on the web browser.
- [Fetch Cache with Next.js](#cache-with-next.js)
  - Nextjs in SSR.
- [Wrap up](#wrap-up)

---

### Cache

You can see the details about the cache in [the MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Request/cache).

1. default
2. force-cache
3. only-if-cached
4. reload
5. no-store
6. no-cache

In this article, I'm not going to cover the `no-cache` cache. Since [Conditional requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Conditional_requests) is involved in it, implementing it would be a little away from the main topic. 

---

### Fetch Cache with VanilaJS

![Server and Client structures](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uap29idyzdxtpmq8x4q7.png)

This is the structure of this example.

If cache-control is enabled, the random-items API responds with the data that includes the header 'Cache-control: private, max-age=5'.

`max-age` tells the client how long they have to keep it in the cache. I'm first going to show you without the cache-control header, with the cache-control header, to see the differences between them.

---

### cache-control off

#### default

![initial screen](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/eqf1jss3jv22bfiv556f.png)

If I click the default button,

![the default button is clicked and the result is shown](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ql7lcog23734hgec1j48.png)

As we expect, it fetches the data from the server. Let's click the default button once more.

![The data is fetched from the server again](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/otpbkj2jqwzf27k8gqif.png)

The data has been fetched from the server again.

#### force-cache

Let's keep the data and click the force-cache button.

![The data comes from the cache](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/a71yjsmupvw1k9cx5c9f.png)

You see the text "from disk cache". It makes sense. Because the cache type is `force-cache`. 

Let's refresh to clear the data.

![The page has refreshed](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q7enncr6j9dm61169a6w.png)

Now, let's click the force-cache button.

![the data is from the cache](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xd25uctr2t1yun87erkp.png)

The data is fetched from the cache again. Let's clear the cache and reload.

![Empty cache and hard reload](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0c1mg49gwbsb0i1zukzq.png)

![Refreshed page](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/84nq2hsrgek757ag2q7f.png)

The cache should be gone. Let's click the force-cache button.

![It requested the data from the server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0m00x16ugk6c9xqwvwss.png)

It didn't find the cached data and requested the data to the server.

If I click the button once more, it will fetch the data from the cache.

![fetched from the cache](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gc3pt78sb7ibx8v1yxgj.png)

#### only-if-cached

I cleaned up the cache.

![first page without cache](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p3sltpoic8yz1ru2cmui.png)

Let's click the only-if-cached button.

![network error](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/27xfrhrizc8hhc3om3dh.png)

![console error](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/n7qmiamoqwh7tegjkirk.png)

It occurs an error, let's click the default button once then retry it.

![fetched the data from the cache](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h74c0j3mnir87m9oac0p.png)

As we expected, it fetched the data from the cache.

#### no-store

The `no-store` doesn't update the cache and fetch the data from the server. I didn't clear the previous one.

Let's click the 'no-store' button.

![fetched the data from the remote server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zkg2nnkm4qnbcmqk7g2e.png)

Now, to see if the data that 'no-store' retrieved is cached, click the force-cache button.

![the cached data is different from the latest data fetched from the server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8pkdpjpmoq9k774b4kam.png)

The data comes from the cache, which means the `no-store` doesn't store the data in the cache.

#### reload

The `reload` always fetches the data from the server but the data will be cached in the local disk. 

Let's click the reload button.

![fetched the data from the server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z9zl8lw7cry5rr6zerd7.png)

It fetched the data from the server. Now, click the force-cache data button, and let's see if the data that just got from the server is cached.

![The data is cached](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cmxk66i8ln3uwnefsqlw.png)

The `reload` updated the cache data accordingly.

---

### cache-control on

#### default

We are going to see only the `default` cache, the rest of the caches work the same way.

![The data is fetched from the server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0zgykx0hgo98082fpnqs.png)

I clicked the default button and it looks the same as we already saw in the previous section.

The difference is that there is the `Cache-Control` header in the response headers.

Let's click the default button within 5 sec before the cache is invalid.

![the default cache retrieved the data from the cache](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/u056yaoj535ukctlyo1e.png)

It retrieved the data from the cache. If the cache is fresh, it uses the cached data while `force-cache` and `only-if-cached` retrieve the data from the cache regardless of the state of the cache.

After 5 seconds, the cache becomes stale. Then if we click the default button,

![The data is fetched from the server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xyp1z9pdzd554qh0709j.png)

It requests the data to the server. 

---

### Fetch Cache with Next.js

![structure of the example with Next.js](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/t9t6fs1wqp0si35h1ijg.png)

In this example, since I use server components, API requests will happen on the server side. So, we can't see the requests on the dev tool.

I set the revalidate of the `random-number` API to 0, otherwise, when it's built, the API will be cached and return the same response.

**[fetch-with-all-cache.tsx]**
```typescript
export default async function FetchWithAllCachePage() {
  const elements = [];

  let api = await fetch('http://localhost:3000/api/random-number', {
    cache: 'default',
    // next: {
    //   revalidate: 3,
    // },
  });

  elements.push(<div key="default">default: {(await api.json()).number}</div>);

  api = await fetch('http://localhost:3000/api/random-number', {
    cache: 'force-cache',
  });

  elements.push(
    <div key="force-cache">force-cache: {(await api.json()).number}</div>
  );

  api = await fetch('http://localhost:3000/api/random-number', {
    cache: 'no-store',
  });

  elements.push(
    <div key="no-store">no-store: {(await api.json()).number}</div>
  );

  api = await fetch('http://localhost:3000/api/random-number', {
    cache: 'reload',
  });

  elements.push(<div key="reload">reload: {(await api.json()).number}</div>);

  api = await fetch('http://localhost:3000/api/random-number', {
    cache: 'only-if-cached',
    mode: 'same-origin',
  });

  elements.push(
    <div key="only-if-cached">only-if-cached: {(await api.json()).number}</div>
  );

  return <div>{elements}</div>;
}
```

This is the code of the test page. All the results will be displayed when the page loads.

---

### Development - Dev Server

![Random numbers corresponding on each cache](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/y69buu8il8z1p6suwnd3.png)

Except for the `only-if-cached` cache, the rest of them have the same value. 

To see if the values are changed, let's refresh the page.

![default and force-cache are the same but the rest of them have been changed.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3sx4cj8hmrum19yrc65e.png)

Initially, I was expecting that `reload` may make a change in the cache. But it doesn't. The `only-if-cached` has changed while there is no difference in the `default` and the `force-cache`.

Let's refresh one more.

![Changed the same way as the previous try](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ukajy9r1eat69vohh81e.png)

It worked the same way as the previous try. Actually, I found something interesting somehow. If I do a hard reload.

![all values have been changed.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ydtdxufejf5gimlevj0l.png)

It changes all the results. One thing I found out here is that the values of each cache can be different at least in the dev server. We will see if it works the same way with the built files.

Lastly, I will apply the `revalidate` to see if the cache is updated after some time instead of the `default` cache.

```typescript
let api = await fetch('http://localhost:3000/api/random-number', {
    // cache: 'default',
    next: {
      revalidate: 3,
    },
  });
```

The cache is valid for 3 seconds.

![the initial page, the result the same as the previous one](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/f7l3u4xf0zxpibcksr56.png)

Now, let's refresh the page before the time has passed.

![the result the same](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jwv76neas9bv75bey4ce.png)

The value of the default is still the same. Let's reload after 3 seconds.

![the cache that used the revalidate option has been updated but the one that used `force-cache` has not](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3w0mltizjcm1qr8m1pwo.png)

The one that used the `revalidate` option has been updated. It works exactly the same as [the document](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating) explains.

However, it's updated when the page is hard reloaded as it did in the previous example.  

---

### Production - Build

I undid the revalidate option to the `default`.

![cache result page](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b3bj7ctbjpe62prb8579.png)

The `default` and `force-cache` have the same number and the `no-store` and `reload` have the same number. Only the `only-if-cached` has a different number.

Let's hard reload to see if the values of `default` and `force-cache`.

![they haven't changed](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7hl1twzht452jlr0upmh.png)

In the built project, the values haven't changed after hard reloading. I think it was because of the development environment.

Let's test the `revalidate` option. It will probably work the same.

![first try](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mkygj13ut1s9tj20mxep.png)

Before 3 seconds (revalidate), if I refresh the page.

![second try](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/85cp3b4nbnoyoyfdspsi.png)

The value is the same.

![value is updated](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zhw7gb6g8whqzg4hn2bo.png)

And after the validation time, it's updated.

---

### Wrap Up

It's done. While I was doing the experiment by myself. I realized that I totally misunderstood the concept of `fetch`. 

There is a way you can cache the data on the client side and caching is also working by interacting with a server.

What made me confused was the usage of `fetch` on the server side with Next.js. But since `fetch` is called from the server side, it's up to the implementation how they implement it. So, basically, the differences in the values of each cache in Next.js don't matter unless the cache works differently from their guide. What we need to do to use caching in the SSR of Next.js is to follow their guide.

I hope this experiment is helpful for someone else.

Happy Coding!
