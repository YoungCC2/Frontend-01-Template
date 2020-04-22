# ECMAScript Language

### 一般命令式编程语言构成
  1. Atom
     - Identifier
     - Literal
  2. Expression
     - Atom
     - Operator
     - Punctuator
  3. Statement
     - Expression
     - Keyword
     - Punctuator
  4. Structure
     - Function
     - Class
     - Process
     - Namespace
  5. Program
     - Program
     - Mould
     - Package
     - Library

#### Atom Identifier & Literal

  - WhiteSpace
    - \<TAB\>：`\t`
    - \<VT\>： `\v`
    - \<FF\>：`\f` 
    - \<SP\>：`\s`
    - \<NBSP\>：NO-BREAK SPACE
    - \<ZWNBSP\>：ZERO WIDTH NO-BREAK SPACE
    - \<USP\>
  - LineTerminator
    - \<LF\>：`\n`
    - \<CR\>：`\r`
    - \<LS\>
    - \<PS\>
  - Comment
    - // comment
    - /* comment */
  - CommonToken
    - IdentifierName
    - Punctuator
    - [NumericLiteral](https://github.com/moling3650/Frontend-01-Template/blob/master/week02/01.Numeric%20Literals.md)
    - [StringLiteral](https://github.com/moling3650/Frontend-01-Template/blob/master/week02/03.String%20Literals.md)
    - Template

#### 基本类型
- Type
  - Number
    - 浮点数比较: Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON
  - String
    - 支持: U+0000 ~ U+10FFFF， 推荐 U+0000 ~ U+FFFF （BMP）
    - 存储: UTF8/UTF16
  - Boolean
  - Null
  - Undifined
  - Symbol

#### 计算机语言分类

````
JS  弱类型 动态语言
PHP 弱类型 动态语言
Patyon 强类型   动态语言
Java   强类型   静态语言
C              静态类型语言
````


##### 课外思考

###### Ascii 和 Unicode 区别 与 发展



```
字符串作为一种数据类型  存在编码问题
因计算机底层只能处理数据, 遇到文本只能转换为数字 早期计算机 8 byte = 1 bit (字节)
1bit 能表示的最大整数是 255 (二进制11111111=十进制255) 更大的数 需要更多字节
由于计算机的历史发展原因 早期只有127个字符被编码存进计算机  这127个字符就是ASCII表
后来各个国家开始自己的编码，韩国的Euc-kr 日本的Shift_JIS 我们国家的国标 GB 

Unicode把所有语言都统一到一套编码里 现代操作系统和大多数编程语言都直接支持Unicode

1. ASCII编码是1个字节，而Unicode编码通常是2个字节
2. Unicode编码转化为“可变长编码”的UTF-8编码(本着节约的精神,解决存储空间的问题-如果统一成Unicode编码，乱码问题从此消失了。但是，如果你写的文本基本上全部是英文的话，用Unicode编码比ASCII编码需要多一倍的存储空间，在存储和传输上就十分不划算)
3.在计算机内存中，统一使用Unicode编码，当需要保存到硬盘或者需要传输的时候，就转换为UTF-8编码
* 用记事本编辑的时候，从文件读取的UTF-8字符被转换为Unicode字符到内存里，编辑完成后，保存的时候再把Unicode转换为UTF-8保存到文件
* 浏览网页的时候，服务器会把动态生成的Unicode内容转换为UTF-8再传输到浏览器
* 类似<meta charset="UTF-8" />的信息，表示该网页正是用的UTF-8编码
```