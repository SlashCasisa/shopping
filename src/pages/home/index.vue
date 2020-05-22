<template>
	<view class="home-index">
		<!-- 轮播图 -->
		<view class="swiper-container">
			<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :circular="true" :interval="interval"
			 :duration="duration">
				<swiper-item v-for="(item,index) in swiperList" :key="item.carousel[0].uid">
					<image :src="item.carousel[0].url" mode="widthFix" class="swiper-image"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="shopList-container">
			 <!-- 猜你喜欢 -->
			 <view class="shoplist-top">
				 <text class="shopLikeLeft">猜你喜欢</text>
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
				swiperList: [],
				keycodesList: []
			}
		},
		onLoad() {
			this.getSwiperList()
		},

		methods: {
			// async getSwiperList(){
			// 	const res = await this.$http("nottoken/getSwipers",'get',{});
			// 	console.log(res,'res###########')
			// }
			// 获取轮播图
			getSwiperList() {
				this.$http("nottoken/getSwipers", 'get', {}).then(res => {
					// console.log(res, '#############')
					this.swiperList = res.data.data.swipers.map(item => {
						item.carousel = JSON.parse(item.carousel)
						return item;
					})
					this.keycodesList = res.data.data.keycode

					// console.log(res.data.data, '$$$$', this.swiperList, this.keycodesList)
				})
			}
		}
	}
</script>

<style lang="scss">
.swiper-image{
	height: 100%!important;
}
.shopList-container{
	padding-top: 10rpx;
	.shopLikeLeft{
		padding-left: 30rpx;
		position: relative;
		&::before{
			position: absolute;
			left:10rpx;
			top:2rpx;
			content: '';
			width: 10rpx;
			height: 40rpx;
			background: #48C568;
		}
	}
}
</style>
