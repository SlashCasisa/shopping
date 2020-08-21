const car = {
	namespaced: true,
	state: {
		car: [] ,// 购物车数组
		classIndex: -1 //分类索引
	},
	mutations: {
		addCar(state, item) {
			let src = state.car
			let srcoff = src.some(it => {
				return it.id === item.id
			})
			if (srcoff) {
				for (let [index, i] of src.entries()) {
					if (src[index].id === item.id) {
						src[index].number = src[index].number + 1
					}
				}
			} else {
				if (src.length > 0) {
					src = [...src,item]
				} else {
					src.push(item)
				}
			}
			state.car = src
			console.log(src,'******carsrc')
		},
		setClass(state, id) {
			state.classIndex = id
		},
		changeRadio(state,id){//改变购物车的选择框
			
			
		}
	},
	actions: {

	}
}

export default car;
