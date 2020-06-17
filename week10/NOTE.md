# 每周总结可以写在这里



###stylesheet
```javascript
    <style title="hello">
    a {
        color: red;
    }
    </style>

    <link rel="stylesheet" title="x" href="data:text/css,p%7Bcolor:blue%7D">

    <div>
    <a href="#">abc</a>
    <p>def</p>
    </div>

    <script>
    let cssRules = document.styleSheets[0].cssRules
    console.log(cssRules)

    cssRules[0].style.fontSize = '40px'
    cssRules[0].style.color = 'blue'
    </script>
```

###reverse

```javascript
  
<div id="a">
  <span>1</span>
  <p>2</p>
  <a href="">3</a>
  <div>4</div>
</div>

<script>
  let a = document.getElementById('a')

  // 1
  // function reverseChildren(el) {
  //   let children = [...el.childNodes]

  //   children.reverse()

  //   for(let child of children) {
  //     el.appendChild(child)
  //   }
  // }

  // 2
  // function reverseChildren(el) {
  //   let l = el.childNodes.length

  //   while(l-- > 0) {
  //     el.appendChild(el.childNodes[l])
  //   }
  // }

  // 3
  function reverseChildren(el) {
    let range = new Range()
    range.selectNodeContents(el)

    let fragment = range.extractContents()
    let l = fragment.childNodes.length
    while(l-- > 0) {
      fragment.appendChild(fragment.childNodes[l])
    }
    el.appendChild(fragment)
  }

  reverseChildren(a)

</script>
```

### range
```javascript
<div id="a">
  123
  <span style="background-color: blueviolet;">456789</span>
  <span>0123456789</span>
</div>

<script>
  const el = document.getElementById('a')

  let range = new Range()

  range.setStart(el.childNodes[1].childNodes[0], 3)
  range.setEnd(el.childNodes[2], 3)

  // range.extractContents()
</script>
```