<template>
	<view class="class-container">
		<view class="class-scroll-container">
			<!-- 左侧 -->
			<scroll-view scroll-y="true" class="class-scroll-left">
				<view class="class-scroll-left-list" v-for="(item,index) in classList" :key="item.id" :class="item.id === indexs && 'selectedClass'" @click="changeClass(item.id)">{{item.name}}</view>
				<!-- <view class="class-scroll-left-list" v-for="(item,index) in classList" :key="item.id" @click="changeClass(item.id)">{{item.name}}</view> -->
			</scroll-view>
			<!-- 右侧 -->
			<scroll-view scroll-y="true" class="class-scroll-right">
				<view class="class-title"> {{ className }}</view>
				<view class="class-list">
					<view class="class-item" v-for="item in goodsList" :key="item.id">
						<view class="class-image"  @click="toShoping(item,'detail')">
							<image :src="item.propaganda[0].url"></image>
						</view>
						<view class="class-content">
							<view class="title"  @click="toShoping(item,'detail')">{{item.name}}</view>
							<view class="info"  @click="toShoping(item,'detail')">{{item.bewrite}}</view>
							<view class="bottom">
								<view class="price"  @click="toShoping(item,'detail')">￥ {{item.price}}</view>
								<view class="shopcar"><text class="green-round cuIcon-cart"  @click="toShoping(item,'addCars')"></text></view>
							</view>
						</view>
					</view>
				</view>
				<view class="class-scroll-right-bottom">
					我也是有底线的~
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				classList: [], //分類列表
				indexs: -1,
				goodsList: [], //分類商品
			}
		},
		onLoad() {
			this.getClassList() //獲取分類列表
			this.indexs = this.$store.state.car.classIndex //將首頁點擊分類的數據通過store傳參
		},
		onShow() {
			if(this.$store.state.car.classIndex >-1){
				this.indexs = this.$store.state.car.classIndex
			}
		},
		computed: {
			className() {
				if (this.classList.length > 0) {
					let index = this.classList.findIndex(item => {
						return item.id === this.indexs
					})
					return this.classList[index].name
				} else {
					return 0
				}
			}
		},
		watch: {
			indexs() {
				this.getGoodList(this.indexs)
			}
		},
		methods: {
			async getClassList() { //獲取分類列表
				let res = await this.$http('nottoken/getAllClass', 'get', {})
				this.classList = res.data.data.class
				console.log(this.classList, 'classList')
				if (this.indexs === -1) {
					this.indexs = this.classList[0].id
				} else {
					this.getGoodList(this.indexs)
				}
				console.log(this.indexs, 'indexs')
			},
			async getGoodList(id) { //獲取對應貨物商品
				let res = await this.$http('nottoken/getOneAllGoods', 'get', {
					id: id
				})
				this.goodsList = res.data.data.map(item => {
					item.propaganda = JSON.parse(item.propaganda)
					return item
				})
				this.indexs = id
			},
			changeClass(id) { //切换分类
				this.indexs = id
			},
			toShoping(item, type) { // 点击猜你喜欢列表进入详情页or购物车
				console.log(item, type)
				if (type === 'detail') {
					uni.navigateTo({
						url: '/pages/shopping/shopping?id=' + item.id,
						animationType: 'pop-in',
						animationDuration: 200
					});
					uni.navigateBack({
						delta: 1,
						animationType: 'pop-out',
						animationDuration: 200
					});
				} else {
					let shoppingList = {
						id: item.id,
						name: item.name,
						number: 1,
						url: item.propaganda[0].url,
						price: parseFloat(item.price),
						checkeds: false,
						val: '0',
					}
					this.$store.commit('car/addCar', shoppingList)
					console.log(this.$store.state.car, '$$$')
					uni.showToast({
						title: '添加成功',
						icon: 'success',
						duration: 2000
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.class-container{
		background: #fff;
	}
	.class-scroll-container {
		display: flex;

		.class-scroll-left {
			width: 25vw;
			text-align: center;
		}
		.class-scroll-left,.class-scroll-right{
			height: 100vh;
			// overflow-y: true;
		}
		

		.class-scroll-left-list {
			background: #fff;
			// color: #fff;
			height: 100rpx;
			line-height: 100rpx;
			border-bottom: 1px solid #e0e0e0;
			font-size: 30rpx;
		}
		.selectedClass {
			background: #91bef0;
			color: #fff;
		}

		.class-scroll-right {
			width: 75vw;
			text-align: center;
			padding: 0 10px;

			.class-title {
				color: grey;
				font-size: 28rpx;
				border-bottom: 1px solid #e0e0e0;
				padding: 5rpx 0;
			}

			.class-item {
				display: flex;

				.class-image {
					width: 150rpx;
					height: 150rpx;

					image {
						height: 100%;
					}
				}

				.class-content {
					text-align: left;
					width: 100%;
					padding: 20rpx 0;
					border-bottom: 1px solid #e0e0e0;
					.title{
						width: 100%;
					}
					.info {
						color: grey;
						width: 100%;
					}

					.bottom {
						display: flex;
						justify-content: space-between;
						padding: 10rpx 0;
						.price {
							font-size: 30rpx;
							color: #f45a6c;
							font-weight: 800;
							padding-top: 10rpx;
						}

						.green-round {
							width: 50rpx;
							height: 50rpx;
							display: inline-block;
							background: #47C470;
							border-radius: 50rpx;
							text-align: center;
							line-height: 50rpx;
							color: #FFFFFF;
							font-size: 24rpx;
						}
					}
				}
			}
			.class-scroll-right-bottom{
				text-align: center;
				color: grey;
			}
		}
	}
</style>
