<template>
	<div id="left_menu_box">
		<div class="logo" @click="collapseFun"><img src="../assets/image/car/logo.png" width="40px" /><span>智慧车辆管理平台</span></div>
		<div class="head-portrait" @click="collapseFun">
			<img src="../assets/image/leftMenu/tx.png" width="30px;" />
			<span>{{user}}</span>
		</div>
		<section class="left_menu">
			<el-menu :default-active="$store.state.activeIndex" class="left_menu_list" background-color="#2c2f32" text-color="#fff"
			 active-text-color="#ffd04b" :router="router" :collapse="isCollapse" unique-opened>
				<el-submenu v-for="(item,i) in leftmenu" :key="i" :index="item.index">
					<template slot="title">
						<i :class="item.sytle"></i>
						<span slot="title" @click="menuChange(item.index)">{{item.name}}</span>
					</template>
				</el-submenu>
			</el-menu>
		</section>
	</div>
</template>
<script>
	export default {
		name: "leftAlarm",
		data() {
			return {
				router: true,
				isCollapse: false,
				user: "",
				leftmenu: [{
						index: "/carManagement",
						name: "车辆管理",
						sytle: "el-icon-menu"
					},
					{
						index: "/carLease",
						name: "车辆租赁",
						sytle: "el-icon-setting"
					}
				]
			};
		},
		mounted() {
			//二级菜单找对齐
			let clas = document.getElementsByClassName('el-menu--inline');
			for (var i = 0; i < clas.length; i++) {
				let claen = clas[i].getElementsByClassName('el-menu-item');
				for (var j = 0; j < claen.length; j++) {
					claen[j].style.padding = "0px 0px 0px 46px";
				}
			};
		},
		created() {
			this.init();
			this.user = sessionStorage.userName;
		},
		methods: {
			init() {
				let href = document.location.href.replace(/^http:\/\/[^/]+/, "");
				let start = href.indexOf("/");
				let end = href.length;
				let end1 = href.lastIndexOf("?");
				let end2 = href.lastIndexOf("#");
				if (end1 != -1 || end2 != -1) {
					end = (end1 < end2) ? end2 : end1;
				}
				let active = href.substring(start, end);
				this.$store.state.activeIndex = active;
			},
			menuChange(indexPath) {
				let href = document.location.href;
				this.$store.state.activeIndex = indexPath;
				this.$router.push({
					path: indexPath
				});
				if (href.indexOf(indexPath) > -1) {
					this.$emit('watchReload', '');
				}
			},
			collapseFun() { //折叠侧边栏
				this.isCollapse = !this.isCollapse;
				if (this.isCollapse) {
					document.getElementById("left_menu_box").style.width = "64px";
					document.getElementsByClassName("head-portrait")[0].getElementsByTagName("span")[0].style.display = "none";
					document.getElementsByClassName("logo")[0].getElementsByTagName("span")[0].style.display = "none";
					document.getElementById("shorten").className = "shorten";
				} else {
					document.getElementById("left_menu_box").style.width = "240px";
					document.getElementsByClassName("head-portrait")[0].getElementsByTagName("span")[0].style.display = "inline-block";
					document.getElementsByClassName("logo")[0].getElementsByTagName("span")[0].style.display = "inline-block";
					document.getElementById("shorten").className = "";
				}
				this.init();
			},
			handleSelect(key, keyPath) {
				this.$store.state.activeIndex = key;
			}
		}
	}
</script>

<style lang="less" scoped>
	#left_menu_box {
		width: 240px;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 2;
		transition: .5s;

		.logo {
			height: 50px;
			line-height: 50px;
			background-color: #248DAC;
			color: #ffffff;
			font-size: 14px;
			overflow: hidden;
			zoom: 1;
			cursor: pointer;

			img {
				vertical-align: middle;
				margin-right: 4px;
			}
		}

		.head-portrait {
			height: 58px;
			line-height: 58px;
			color: #ffffff;
			background-color: #2c2f32;
			padding-left: 0px;
			cursor: pointer;

			img {
				border-radius: 100%;
				width: 30px;
				height: 30px;
				margin-right: 4px;
				vertical-align: middle;
			}
		}
	}

	.left_menu {
		width: 100%;
		position: absolute;
		left: 0;
		top: 100px;
		bottom: 0;
		right: 0;
		overflow-y: auto;
		background: #2c2f32;

		ul ul li {
			background-color: #27292b !important;
		}
	}

	.left_menu .is-active {
		span {
			color: #858585;
		}

		.imgdiv {
			background-position: 0 -12px;
		}
	}

	.left_menu a.link-active {
		font-size: 14px;
	}

	.left_menu_list {
		background-color: #2c2f32;
		color: #ffffff;
		font-size: 12px;

		.is-active {
			background-color: #3a3d40 !important;
		}

		.imgdiv {
			width: 12px;
			height: 12px;
			display: inline-block;
			margin-right: 10px;
			background-position: 0 0;
			background-size: 12px 24px;
		}
	}

	.el-menu {
		border-right: 0;
	}
</style>
<style lang="less">
	.left_menu_list {

		.el-submenu__title,
		.el-menu-item {
			font-size: 12px;
		}

		.is-active {
			border-left: solid 4px #0e8ee7;

			.el-submenu__title {
				border-left: solid 4px #0e8ee7;
			}
		}

		.el-submenu {
			border: none;
		}

		.el-menu--inline {
			.is-active {
				border: none;
			}
		}
	}
</style>
