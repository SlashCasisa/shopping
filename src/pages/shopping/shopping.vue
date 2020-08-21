<template>
	<view class="shopping">
		<scroll-view scroll-y="true" class="shoping-Scroll">
			<!-- 轮播图 -->
			<view class="swiper-container">
				<swiper class="swiper" :indicator-dots="true" :autoplay="true" :circular="true" :interval="true" :duration="duration">
					<swiper-item v-for="(item,index) in goodsDetail.carousel" :key="item.carousel.uid">
						<image :src="item.url" mode="aspectFill" class="swiper-image"></image>
					</swiper-item>
				</swiper>
			</view>
			<!-- 商品信息 -->
			<view class="shopping-info-container">
				<view class="shopping-name">
					{{goodsDetail.name}}
				</view>
				<view class="shopping-describe">
					{{goodsDetail.bewrite}}
				</view>
				<view class="shopping-pick">
					<text>￥</text>
					<text>{{ goodsDetail.vip_price>0 ? goodsDetail.vip_price : goodsDetail.price}}</text>
					<text v-if="goodsDetail.vip_price>0">￥{{goodsDetail.price}}</text>
				</view>
				<view class="shopping-time">
					<view class="shopping-time-list">
						<text class="cuIcon-timefill">
							最快29分送达
						</text>
					</view>
				</view>
			</view>
			<!-- 评论 -->
			<view class="shopping-content-container">
				<view class="shopping-content-title">评论</view>
				<view class="shopping-content">
					<view class="shopping-content-top">
						<view class="content-lf">
							<image src="../../static/img/tabbar/h2.png"></image>
						</view>
						<view class="content-center">
							<view class="user-name"><text>用户名</text></view>
							<view class="comment-score">
								<text class="cuIcon-favorfill"></text>
								<text class="cuIcon-favorfill"></text>
								<text class="cuIcon-favorfill"></text>
								<text class="cuIcon-favorfill"></text>
								<text class="cuIcon-favorfill"></text>
							</view>
							<view class="comment">很满意</view>
						</view>
						<view class="content-rg">
							<text>12:52:23</text>
						</view>
					</view>
					<view class="shopping-content-bottom">
						<view class="shopping-content-more">查看更多&nbsp;&nbsp;(630)</view>
					</view>
				</view>
			</view>
			<!-- 规格 -->
			<view class="shoping-Specifications-container ">
				<view class="shoping-Specifications-title">规格</view>
				<view class="shoping-Specifications-list">
					<view class="shoping-Specifications-list-left">净含量</view>
					<view class="shoping-Specifications-list-right">{{goodsDetail.weight}}</view>
				</view>
				<view class="shoping-Specifications-list">
					<view class="shoping-Specifications-list-left">保存条件</view>
					<view class="shoping-Specifications-list-right">{{goodsDetail.weight}}</view>
				</view>
				<view class="shoping-Specifications-list">
					<view class="shoping-Specifications-list-left">保质期</view>
					<view class="shoping-Specifications-list-right">{{goodsDetail.weight}}</view>
				</view>

			</view>
			<!-- 宣传图 -->
			<view class="shoping-imgs">
				<image v-for="(item,index) in goodsDetail.propaganda" :key='index' :src="item.url"></image>
			</view>
			<!-- 底部 -->
			<view class="shoping-foot">
				我也是有底线的~
			</view>
		</scroll-view>
		<!-- 购物车 -->
		<view class="cu-bar bg-white tabbar border shop  shopcar-container">
			<button class="action" open-type="contact" @click="goCars">
				<view class="cuIcon-cart">
					<view class="cu-tag badge" v-show="carNumber > 0">{{carNumber}}</view>
				</view>
				购物车
			</button>
			<view class="action">

			</view>
			<view class="btn-group">
				<button class="cu-btn bg-orange round shadow-blur" @click="addCars">加入购物车</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsDetail: {}
			}
		},
		async onLoad(options) {
			console.log(options, '###')
			// const item = JSON.parse(decodeURIComponent(options.item));
			// console.log(item,'item###')
			let res = await this.$http('nottoken/searchGood', 'get', {
				id: options.id
			})
			res.data.data.carousel = JSON.parse(res.data.data.carousel)
			res.data.data.propaganda = JSON.parse(res.data.data.propaganda)
			this.goodsDetail = res.data.data
			// console.log(this.goodsDetail, '$$$res')
		},
		computed:{
			carNumber:function(){
				return this.$store.state.car.car.length
			}
		},
		methods:{
			goCars(){//跳转到购物车
				uni.switchTab({
				    url: '/pages/index/index',
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			addCars(){//加入购物车
				let shoppingList={
					id: this.goodsDetail.id,
					name: this.goodsDetail.name,
					number:1,
					url: this.goodsDetail.propaganda[0].url,
					price: parseFloat(this.goodsDetail.price),
					checkeds: false,
					val: '0',
				}
				this.$store.commit('car/addCar',shoppingList)
				console.log(this.$store.state.car,'$$$')
				uni.showToast({
					title: '添加成功',
					icon: 'success',
					duration: 2000
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.shopping {
		margin: 5px 0;
	}

	.swiper {
		height: 450rpx;

		// .swiper-image {
		// 	height: auto;
		// }
	}

	.shopping-info-container {
		padding: 20rpx;

		.shopping-name {
			font-size: 30rpx;
			font-weight: 800;
		}

		.shopping-describe {
			font-size: 28rpx;
			color: grey;
			padding: 10rpx 0;
		}

		.shopping-pick {
			font-size: 30rpx;
			color: #f45a6c;
			font-weight: 800;
		}

		.shopping-time {
			font-size: 24rpx;
			padding: 10rpx 0;
		}
	}

	.shopping-content-container {
		padding: 10rpx;

		.shopping-content-title {
			font-size: 28rpx;
			font-weight: 800;
			padding-bottom: 10px;
		}

		.shopping-content {
			.shopping-content-top {
				display: flex;

				.content-lf {
					image {
						width: 50rpx;
						height: 50rpx;
					}
				}

				.content-center {
					width: 80vw;
					padding-left: 20rpx;

					.user-name,
					.comment-score,
					.comment {
						padding: 5rpx 0;
					}
				}
			}

			.shopping-content-bottom {
				text-align: center;
				padding-top: 20rpx;

				.shopping-content-more {
					border: 1rpx solid #aaa;
					border-radius: 20rpx;
					text-align: center;
					line-height: 28rpx;
					font-size: 28rpx;
					color: #727272;
					padding: 10rpx;
					width: 35%;
					margin-left: 35%;
				}
			}
		}
	}

	.shoping-Specifications-container {
		padding: 10rpx;

		.shoping-Specifications-title {
			font-weight: 800;
			font-size: 28rpx;
			padding-bottom: 10rpx;
		}

		.shoping-Specifications-list {
			display: flex;
			padding: 10rpx 0;
			font-size: 32rpx;
			// border-top: 1px solid #aaa;
			border-bottom: 1px solid #E0E0E0;

			.shoping-Specifications-list-left {
				width: 20vw;
			}
		}
	}

	.shoping-foot {
		text-align: center;
		padding: 10rpx 0;
	}
	.shopcar-container{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100vw;
	}
</style>
