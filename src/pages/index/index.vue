<template>
	<view class="content">
		<!-- <image class="logo" src="/static/img/logo.png"></image> -->
		<!-- <view> -->
		<!-- <text class="title">{{title}}</text> -->
		<!-- </view> -->
		<view @click="clickDownloadFile">下载并打开国务院文档</view>
		<view>已下载{{downloadfile_num}}</view>
		<view @click="StorageApi">StorageApi</view>
		<view @click="mapApi">mapApi</view>
		<view @click="mapApi2">查看位置</view>
		<!-- <view @click="clickGoCar">跳转到购物车</view> -->
		<map id="map1" ref="map1" longitude='113.07845' :markers="covers" latitude='22.59514'></map>
		<view @click="moveMarkers">move markers</view>
		<editor id="editor" class="ql-container" :placeholder="placeholder" @ready="onEditorReady"></editor>
		<view @click="login">登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// title: 'Hello',
				num: 0,
				downloadfile_num: 0,
				covers: [{
					id: 0,
					latitude: 22.59614,
					longitude: 113.07845,
					iconPath: '../../static/img/location_img.png'
				}, {
					id: 1,
					latitude: 22.59514,
					longitude: 113.07745,
					iconPath: '../../static/img/location_img.png'
				}, {
					id: 2,
					latitude: 22.59514,
					longitude: 113.07845,
					iconPath: '../../static/img/location_img.png'
				}],
				map: {},
				placeholder: '开始输入...',
			}
		},
		onLoad() {

		},
		onReady() {
			this.map = uni.createMapContext('map1', this)
			this.initMap()
		},
		methods: {
			// clickGoCar(){
			// 	uni.reLaunch({
			// 		url: '/pages/cart/cart'
			// 	});
			// },
			// clickDownloadFile(){下载文件并查看进度
			// 	const downloadTask = uni.downloadFile({
			// 	    url: 'http://www.gov.cn/zhengce/pdfFile/2020_PDF.pdf', //仅为示例，并非真实的资源
			// 	    success: (res) => {
			// 	        if (res.statusCode === 200) {
			// 	            console.log('下载成功');
			// 	        }
			// 	    }
			// 	});

			// 	downloadTask.onProgressUpdate((res) => {
			// 	    console.log('下载进度' + res.progress);
			// 	    console.log('已经下载的数据长度' + res.totalBytesWritten);
			// 	    console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);

			// 	    // 测试条件，取消下载任务。
			// 	    if (res.progress > 50) {
			// 	        downloadTask.abort();//中断下载任务
			// 	    }
			// 	});
			// }
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
					this.editorCtx.format('align', 'right')
				}).exec()
			},
			clickDownloadFile() { //下载并打开国务院文档
				this.num++
				uni.downloadFile({
					url: 'http://www.gov.cn/zhengce/pdfFile/2020_PDF.pdf',
					success: ({
						statusCode,
						tempFilePath
					}) => {
						if (statusCode === 200) {
							// console.log(statusCode,'statusCode',tempFilePath,'tempFilePath');
							// //保存到本地
							uni.saveFile({
								tempFilePath,
								success: (res) => {
									console.log(tempFilePath, res)
									//res.savedFilePath文件的保存路径
									//保存成功并打开文件
									uni.openDocument({
										filePath: res.savedFilePath,
										success: (res) => console.log('成功打开文档'),
										fail: (error) => console.log('打开文档失败', error)
									})
								},
								fail: () => console.log('下载失败')
							})
						}
					}
				});
				uni.setStorage({ //存入本地
					key: 'downloadFile_num',
					data: {
						num: this.num
					},
					success: function() {
						console.log('success');
					}
				});
				const _this = this
				uni.getStorage({
					key: 'downloadFile_num',
					success: function(res) {
						console.log(res.data, 'getStorage');
						_this.downloadfile_num = res.data.num
					}
				});
			},

			StorageApi() {
				uni.getStorageInfo({
					success: function(res) {
						console.log(res);
						console.log(res.currentSize);
						console.log(res.limitSize);
					}
				});
				try {
					const res = uni.getStorageInfoSync();
					console.log(res.keys, 'sync');
					console.log(res.currentSize, 'sync');
					console.log(res.limitSize, 'sync');
				} catch (e) {
					// error
				}
			},
			mapApi() {
				uni.getLocation({
					type: 'gcj02',
					success: function(res) {
						console.log(res, 'res#####')
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);
					}
				});
				uni.chooseLocation({
					// longitude: lgt,
					// latitude: lat,
					success: function(res) {
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
					}
				});
			},
			mapApi2() {
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					success: function(res) {
						const latitude = res.latitude;
						const longitude = res.longitude;
						uni.openLocation({
							latitude: latitude,
							longitude: longitude,
							success: function() {
								console.log('success');
							}
						});
					}
				});
			},
			initMap() {

				let lat = 0
				let lg = 0
				let _this = this
				this.map.getCenterLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					success: function(res) {
						console.log(res, '#res#')
						lat = res.latitude
						lg = res.longitude
						_this.map.moveToLocation({
							longitude: lg,
							latitude: lat,
							success: function(res) {
								console.log(res, 'movesuccess')
							},
							fail: (err => {
								console.log(err, 'moveerr')
							})
						})
					}
				})

			},
			moveMarkers() {
				//平移marker
				// const map = uni.createMapContext('map1', this)
				this.map.translateMarker({
					markerId: 1,
					destination: {
						latitude: 22.59514,
						longitude: 113.07945
					},
					autoRotate: true,
					rotate: 90,
					fail: ((err) => {
						console.log(err, 'err move marker')
					})
				})
				let pointList = []
				pointList = this.covers.map(item => {
					return {
						latitude: item.latitude,
						longitude: item.longitude
					}
				})
				this.map.includePoints({
					points: pointList,
					padding: ['10px', '10px', '10px', '10px']
				})
				this.map.getRegion({
					success: (res => {
						console.log(res, 'res#')
					})
				})
				this.map.getRegion({
					success: (res => {
						console.log(res, 'res#')
					})
				})
			},
			login(){
				console.log('#login#')
				uni.login({
				  provider: 'weixin',
				  success: function (loginRes) {
				    console.log(loginRes.authResult);
					  // 获取用户信息
					    uni.getUserInfo({
					      provider: 'weixin',
					      success: function (infoRes) {
							  console.log(infoRes)
					        console.log('用户昵称为：' + infoRes.userInfo.nickName);
					      }
					    });
				  }
				});
			}
		}
		
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}

	.container {
		padding: 10px;
	}

	#editor {
		width: 100%;
		height: 300px;
		background-color: #CCCCCC;
	}

	button {
		margin-top: 10px;
	}
</style>
