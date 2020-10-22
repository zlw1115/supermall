import {request} from './request'

export function getHomeMultidata(){
  // 返回的是一个Promise
  return request({
    url:"/home/multidata"
  })
}

export function getHomeGoods(type,page){
  return request({
    url:'/home/data',
    params:{
      type,
      page
    }
  })
}

// 函数调用 -> 压入函数栈（保存函数调用过程中所有变量）
// 函数调用结果 -> 弹出函数栈（释放函数所有的变量）
// function test(){
//   const name = ['why','zlw']

// }

// test()//创建函数中的变量->结束调用，变量销毁
// test()//再次创建函数中的变量->结束调用，变量销毁

// let totalNums = []
// const nums1 = [20,11,22]

// for (let n  of nums1){
//   totalNum.push(n)
// }

// totalNums.push(...nums1)