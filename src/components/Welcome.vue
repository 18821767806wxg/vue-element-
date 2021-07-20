<template>
  <div>
    <p>FullName: {{ fullName }}</p>
    <p>FirstName: <input type="text" v-model="firstName" /></p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      firstName: 'Dawei',
      lastName: 'Lou',
      fullName: ''
    }
  },
  watch: {
    // 简单的监听事件
    firstName(newName, oldName) {
      this.fullName = newName + ' ' + this.lastName
    }
  },
  mounted() {
    // this.fn('abcccccc')
  },
  methods: {
    fn(str) {
      var hash = {}
      for (let i = 0; i < str.length; i++) {
        // console.log('str[i]', str[i])
        console.log('hash[str[i]]', hash[str[i]]) //对象默认没有那一项undefined
        if (hash[str[i]]) {
          hash[str[i]]++
          // console.log('11', hash[str[i]])
        } else {
          hash[str[i]] = 1
        }
      }
      console.log(hash)
    }
  }
}
</script>
