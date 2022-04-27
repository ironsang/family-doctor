/* privateChat.js */
var utils = require('../../utils/util.js')
var inquiry_db = require('../../utils/inquiry_db.js')
Page({
	data: {
		content_bg: 1,
		inquiryDB: inquiry_db['inquiry'],
		messages: [],
		currentRoom: {},
		welcomeMessage: '保持积极乐观的心态，祝您康复',
		doctorAvatar: './../../static/images/doctor-avatar.png'
	},
	onLoad: function (options) {
		// 初始化传过来的数据
		let roomToken = JSON.parse(options.roomToken);
		// 根据roomId 获取第一个问题
		let inquiry_key = roomToken.roomId + '@1';
		// 初始化聊天室数据
		this.setData({
			messages: [
				{
					timestamp: new Date(),
					senderId: roomToken.roomId,
					node: roomToken.roomId,
					type: 'text'
				},
				{
					timestamp: new Date(),
					senderId: roomToken.roomId,
					node: inquiry_key,
					type: 'text'
				}, {
					timestamp: new Date(),
					senderId: roomToken.userId,
					node: inquiry_key,
					selected: -1,
					type: 'choose'
				}],
			currentRoom: {
				roomId: roomToken.roomId,
				roomName: roomToken.roomName,
				inquiry_key: inquiry_key,
				currentUser: {
					id: roomToken.userId,
					nickname: roomToken.nickname,
					avatar: roomToken.avatar
				}
			},
			content_bg: roomToken.bg
		});
		// 设置自诊室标题
		wx.setNavigationBarTitle({
			title: roomToken.roomName
		});
		this.scrollToBottom();
	},
	onUnload() {
	},
	sendMessage(message) {
		let self = this;
		self.data.messages.push(message);
		self.renderMessages(this.data.messages);
		self.scrollToBottom();
		// TODO sendMessage by sangchg
	},
	renderMessages(messages) {
		messages.forEach((message, index) => {
			if (index === 0) {
				// 当页面只有一条消息时，显示发送时间
				message.showTime = utils.formatTime(message.timestamp);
			} else {
				// 当前消息与上条消息的发送时间进行比对，超过5分钟则显示当前消息的发送时间
				if (message.timestamp - messages[index - 1].timestamp > 5 * 60 * 1000) {
					message.showTime = utils.formatTime(message.timestamp);
				}
			}
		});
		this.setData({
			messages: messages
		});
	},
	onChoose(e) {
		let self = this;
		// 当前点击节点的node
		let selectNode = e.currentTarget.dataset.node;
		// 如果当前所在的节点大于当前点击的节点，代表有反悔的情况，需要清空以后的记录
		if (selectNode.length < self.data.currentRoom.inquiry_key.length) {
			let _messages = new Array();
			for (var i = 0; i < self.data.messages.length; i++) {
				if (selectNode.length < self.data.messages[i].node.length) {
						break
				}
				_messages[i] = self.data.messages[i]
			};
			self.data.messages = _messages;
			self.data.currentRoom.inquiry_key = selectNode;
		}
		// 处理选择按钮的情况
		let chooseValue = e.currentTarget.dataset.choose;
		let inquiry_key = self.data.currentRoom.inquiry_key + '' + chooseValue;
		self.data.currentRoom.inquiry_key = inquiry_key;
		self.data.messages[self.data.messages.length - 1].selected = chooseValue;

		// 判断是否最后一个，如果不是需要追加一个选项
		let textMessage = {
			timestamp: new Date(),
			senderId: self.data.currentRoom.roomId,
			node: inquiry_key,
			type: 'text'
		}
		self.sendMessage(textMessage);

		// 下一个问题
		self.nextQuestion();
	},
	nextQuestion() {
		let self = this;
		let inquiry_key = self.data.currentRoom.inquiry_key;
		if (inquiry_db['inquiry'][inquiry_key + '1'] || inquiry_db['inquiry'][inquiry_key + '0']) {
			let textMessage = {
				timestamp: new Date(),
				senderId: self.data.currentRoom.currentUser.id,
				node: inquiry_key,
				selected: -1,
				type: 'choose'
			}
			self.sendMessage(textMessage);
		}
	},
	scrollToBottom() { // 滑动到最底部
		wx.pageScrollTo({
			scrollTop: 200000,
			duration: 10
		})
	}
})