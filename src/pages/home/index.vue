<template>
	<view class="home-container">
		<!-- 轮播图 -->
		<view class="swiper-container">
			<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :circular="true" :interval="interval"
			 :duration="duration">
				<swiper-item v-for="(item,index) in swiperList" :key="item.carousel[0].uid">
					<image :src="item.carousel[0].url" mode="scaleToFill" class="swiper-image"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 导航 -->
		<view class="nav-list-container">
			<view class="nav-item image-item" v-for="item in navClassList" :key="item.id" @click="enterClass(item.id)">
				<!-- <image :src="item.image[0].url"></image> -->
				<view class="image-content">
					<image  mode="aspectFill" :src="item.image[0].url"></image>
				</view>
				<view class="nav-item-name">
					{{item.name}}
				</view>
			</view>
		</view>
		<!-- 猜你喜欢 -->
		<view class="shopList-container">
			<view class="shoplist-top">
				<text class="shopLikeLeft">猜你喜欢</text>
			</view>
			<view class="shoplist-item-container">
				<view class="shoplist-item" v-for="(item,index) in homeLiveAll" :key="item.id">
					<!-- 图片 -->
					<view class="shoplist-item-img" @click="toShoping(item,'detail')">
						<image class="item-image" :src="item.propaganda[0].url" mode="aspectFill"></image>
					</view>
					<!-- 图片文字介绍 -->
					<view class="shoplist-item-info ellipsis" @click="toShoping(item,'detail')">
						{{item.name}}
					</view>
					<!-- <navigator :url="'/pages/shopping/shopping?item='+ encodeURIComponent(JSON.stringify(item))"> -->
						<!-- <view class="shoplist-item-info ellipsis"> -->
							<!-- {{item.name}} -->
						<!-- </view> -->
					<!-- </navigator> -->
					<!-- 价格和购物车 -->
					<view class="shoplist-item-bottom">
						<view class="bottom-left" @click="toShoping(item,'detail')">
							<text>￥{{item.price}}</text>
						</view>
						<view class="bottom-right" @click="toShoping(item,'addCars')">
							<text class="green-round cuIcon-cart"></text>
						</view>

					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				indicatorDots: true,
				autoplay: true,
				interval: 5000,
				duration: 500,
				swiperList: [], //轮播图列表
				keycodesList: [],
				homeLiveAll: [], //猜你喜欢列表
				navClassList: [], //导航分类列表
			}
		},
		onLoad() {
			this.getSwiperList() //获取轮播图列表
			this.getHomeLiveAllList() //获取猜你喜欢列表
			this.getnavClassList() //获取导航分类列表
		},

		methods: {
			// async getSwiperList(){
			// 	const res = await this.$http("nottoken/getSwipers",'get',{});
			// 	console.log(res,'res###########')
			// }
			// 获取轮播图
			getSwiperList() { //轮播图
				this.$http("nottoken/getSwipers", 'get', {}).then(res => {
					// console.log(res, '#############')
					this.swiperList = res.data.data.swipers.map(item => {
						item.carousel = JSON.parse(item.carousel)
						return item;
					})
					this.keycodesList = res.data.data.keycode

					// console.log(res.data.data, '$$$$', this.swiperList, this.keycodesList)
				})
			},
			async getHomeLiveAllList() { //猜你喜欢列表
				let This = this
				const res = await this.$http('nottoken/homeLive', 'get', {
					current: 1,
					pageSize: 10
				})
				if (res.data.code === 0) {
					let jsonData = res.data.data
					jsonData.map(item => {
						item.propaganda = JSON.parse(item.propaganda)
						return item
					})
					This.homeLiveAll = [...This.homeLiveAll, ...jsonData]
					// console.log(This.homeLiveAll, '$')
				}
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
					// console.log(this.$store.state.car, '$$$')
					uni.showToast({
						title: '添加成功',
						icon: 'success',
						duration: 2000
					})
				}
			},
			async getnavClassList() { //获取导航分类列表
				let res = await this.$http('nottoken/getOneClass', 'get', {})
				this.navClassList = res.data.data.map(item => {
					item.image = JSON.parse(item.image)
					return item;
				})
				// console.log(this.navClassList, 'navClassList')
			},
			enterClass(id){//进入分类列表
				this.$store.commit('car/setClass',id)
				uni.switchTab({
				    url: '/pages/class/class'
				});
			}
		}
	}
</script>

<style lang="scss">
	.home-container{
		background: #fff;
	}
	.swiper-container{
		width: 100vw;
	}
	.swiper-image {
		height: 100% !important;
	}

	.nav-list-container {
		display: flex;
		flex-wrap: wrap;
		.nav-item{
			width: 20vw;
			text-align: center;
			padding: 10rpx;
			padding-bottom: 15rpx;
			.image-content{
				width: 15vw;
				height: 15vw;
				image{
					height: 15vw;
					border-radius: 100rpx;
				}
			}
		}
	}

	.shopList-container {
		padding-top: 20rpx;

		.shopLikeLeft {
			padding-left: 30rpx;
			position: relative;
			height: 22rpx;
			line-height: 22rpx;
			padding-top: 10rpx;

			&::before {
				position: absolute;
				left: 10rpx;
				top: 6rpx;
				content: '';
				width: 10rpx;
				height: 40rpx;
				background: #48C568;
			}
		}

		.shoplist-item-container {
			display: flex;
			flex-wrap: wrap;
			padding: 10rpx;

			.shoplist-item {
				// text-align: center;
				width: 50%;
			}

			.shoplist-item-img {
				height: 145px;
				padding: 17px 2px;

				.item-image {
					height: 100%;
					width: 100%;
				}
			}

			.shoplist-item-info {
				font-size: 28rpx;
				height: 30rpx;
				line-height: 30rpx;
				padding: 10rpx 10rpx 30rpx 10rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}

			.shoplist-item-bottom {
				display: flex;
				justify-content: space-between;
				padding: 10rpx;

				.bottom-left {
					font-size: 30rpx;
					color: #f45a6c;
					font-weight: 800;
					padding-top: 10rpx;
				}

				.bottom-right {
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

					.cuIcon-cart {
						&::before {
							content: "\e6af";
						}
					}
				}

			}
		}
	}
</style>
