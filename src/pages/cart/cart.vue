<template>
	<view class="cart-container">
		<view class="shopcar-list-container">
			<view class="shopcar-item" v-for="item in carList" :key="item.id">
				<!-- 选择框 -->
				<view class="choose-radio" @click="changeRadio(item.id)" :class="item.checkeds?'text-blue cuIcon-roundcheckfill':'text-gray cuIcon-round'"></view>
				<!-- 图片 -->
				<view class="shopcar-image">
					<image :src="item.url"></image>
				</view>
				<!-- 内容 -->
				<view class="shopcar-content">
					<view class="name">{{item.name}}</view>
					<view class="bottom">
						<view class="price">￥{{item.price}}</view>
						<view class="num-container">
							<text class="lg text-gray cuIcon-move" @click="removeNumber(item.id)"></text>
							<text class="num">{{item.number}}</text>
							<text class="lg text-gray cuIcon-add" @click="addNumber(item.id)"></text>
						</view>
					</view>
				</view>
			</view>
		</view>
		 <!-- 猜你喜欢 -->
		 <view class="shopList-container">
		 	<view class="shoplist-top">
				<text class="lg text-gray cuIcon-title"></text>
		 		<text class="shopLikeLeft">猜你喜欢</text>
				<text class="lg text-gray cuIcon-title"></text>
		 	</view>
		 	<view class="shoplist-item-container">
		 		<view class="shoplist-item" v-for="(item,index) in goodsList" :key="item.id">
		 			<!-- 图片 -->
		 			<view class="shoplist-item-img" @click="toShoping(item,'detail')">
		 				<image class="item-image" :src="item.propaganda[0].url" mode="aspectFill"></image>
		 			</view>
		 			<!-- 图片文字介绍 -->
		 			<view class="shoplist-item-info ellipsis" @click="toShoping(item,'detail')">
		 				{{item.name}}
		 			</view>
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
	export default{
		data(){
			return {
				goodsList:[],//猜你喜欢列表
			}
		},
		onLoad(){
			this.getGoodList()//获取猜你喜欢列表
		},
		computed:{
			carList(){
				return this.$store.state.car.car
			}
		},
		methods:{
			async getGoodList(){//获取猜你喜欢列表
				let res = await  this.$http('nottoken/getBuyGoods','get',{
					current: 1,
					pageSize: 10
				})
				let newsGoods = res.data.data.map(item=>{
					item.propaganda = JSON.parse(item.propaganda)
					return item
				})
				this.goodsList = [...this.goodsList,...newsGoods]
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
			changeRadio(id){
				this.$store.commit('changeRadio',id)
			}
		}
	}
</script>

<style lang="scss">
	.cart-container{
		background: #fff;
	}
	.shopcar-item{//购物车列表
		display: flex;
		margin: 5px;
		border-bottom: 1px solid #e0e0e0;
		.choose-radio{
			height: 150rpx;
			line-height: 150rpx;
			margin: 0 10rpx;
			font-size: 36rpx;
		}
		.shopcar-image{
			width: 150rpx;
			height: 150rpx;
			image{
				height: 100%;
			}
		}
		.shopcar-content{
			padding: 10rpx 0 0 10rpx;
			font-weight: 800;
			width: 100%;
			display: flex;
			flex-direction: column;
			.name{
				height: 60%;
			}
			.bottom{
				display: flex;
				font-weight: 400;
				justify-content: space-between;
				.num-container{
					font-size: 26rpx;
					.num{
						padding: 0 10rpx;

					}
				}
			}
		}
	}
	.shopList-container {
		padding-top: 20rpx;
	
		.shoplist-top {
			text-align: center;
			font-size: 26rpx;
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
