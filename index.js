// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import session from "express-session";
import createMemoryStore from "memorystore";
var MemoryStore = createMemoryStore(session);
var MemStorage = class {
  users = /* @__PURE__ */ new Map();
  challenges = /* @__PURE__ */ new Map();
  achievements = /* @__PURE__ */ new Map();
  friendships = /* @__PURE__ */ new Map();
  leagues = /* @__PURE__ */ new Map();
  leagueMembers = /* @__PURE__ */ new Map();
  currentUserId = 1;
  currentChallengeId = 1;
  currentAchievementId = 1;
  currentLeagueId = 1;
  currentAvatarId = 1;
  currentChallengeResultId = 1;
  currentChallengeEmoteId = 1;
  currentLeagueMessageId = 1;
  avatars = /* @__PURE__ */ new Map();
  challengeResults = /* @__PURE__ */ new Map();
  challengeEmotes = /* @__PURE__ */ new Map();
  friendRequests = /* @__PURE__ */ new Map();
  items = /* @__PURE__ */ new Map();
  emotes = /* @__PURE__ */ new Map();
  trophies = /* @__PURE__ */ new Map();
  leagueMessages = /* @__PURE__ */ new Map();
  challengeInvitations = /* @__PURE__ */ new Map();
  challengeParticipants = /* @__PURE__ */ new Map();
  currentInvitationId = 1;
  currentParticipantId = 1;
  sessionStore;
  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
    });
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  async getAllUsers() {
    return Array.from(this.users.values());
  }
  async createUser(user) {
    const id = this.currentUserId++;
    const newUser = {
      id,
      ...user,
      score: 0,
      wins: 0,
      losses: 0,
      winStreak: 0,
      maxWinStreak: 0,
      challengesCompleted: 0,
      lastActiveAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, newUser);
    return newUser;
  }
  async updateUserWins(userId, wins) {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    user.wins = wins;
    return user;
  }
  async updateUserLosses(userId, losses) {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    user.losses = losses;
    return user;
  }
  async updateUserScore(userId, score) {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    user.score = score;
    return user;
  }
  async updateUserWinStreak(userId, streak) {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    user.winStreak = streak;
    return user;
  }
  async updateUserMaxWinStreak(userId, maxStreak) {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    user.maxWinStreak = maxStreak;
    return user;
  }
  async updateUserChallengesCompleted(userId, count) {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    user.challengesCompleted = count;
    return user;
  }
  async createChallenge(challenge) {
    const id = this.currentChallengeId++;
    const newChallenge = {
      id,
      status: "open",
      acceptorId: null,
      winnerId: null,
      creatorVerifiedReward: false,
      acceptorVerifiedReward: false,
      createdAt: /* @__PURE__ */ new Date(),
      ...challenge
    };
    this.challenges.set(id, newChallenge);
    return newChallenge;
  }
  async getChallenge(id) {
    return this.challenges.get(id);
  }
  async getChallenges(status) {
    const challenges2 = Array.from(this.challenges.values());
    return status ? challenges2.filter((c) => c.status === status) : challenges2;
  }
  async acceptChallenge(challengeId, acceptorId) {
    const challenge = await this.getChallenge(challengeId);
    if (!challenge) throw new Error("Challenge not found");
    const updatedChallenge = {
      ...challenge,
      status: "accepted",
      acceptorId
    };
    this.challenges.set(challengeId, updatedChallenge);
    return updatedChallenge;
  }
  async completeChallenge(challengeId, winnerId) {
    const challenge = await this.getChallenge(challengeId);
    if (!challenge) throw new Error("Challenge not found");
    const updatedChallenge = {
      ...challenge,
      status: "completed",
      winnerId
    };
    this.challenges.set(challengeId, updatedChallenge);
    return updatedChallenge;
  }
  async updateChallengeStatus(challengeId, status, winnerId) {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) throw new Error("Challenge not found");
    const updatedChallenge = {
      ...challenge,
      status,
      ...winnerId && { winnerId }
    };
    this.challenges.set(challengeId, updatedChallenge);
    return updatedChallenge;
  }
  async updateRewardVerification(challengeId, isCreator) {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) throw new Error("Challenge not found");
    const updatedChallenge = {
      ...challenge,
      ...isCreator ? { creatorVerifiedReward: true } : { acceptorVerifiedReward: true }
    };
    this.challenges.set(challengeId, updatedChallenge);
    return updatedChallenge;
  }
  async getUserChallenges(userId) {
    const challenges2 = Array.from(this.challenges.values());
    return challenges2.filter(
      (c) => c.creatorId === userId || c.acceptorId === userId
    );
  }
  async getAchievements(userId) {
    return this.achievements.get(userId) || [];
  }
  async addAchievement(userId, type) {
    const id = this.currentAchievementId++;
    const achievement = {
      id,
      userId,
      type,
      data: null,
      earnedAt: /* @__PURE__ */ new Date()
    };
    const userAchievements = this.achievements.get(userId) || [];
    userAchievements.push(achievement);
    this.achievements.set(userId, userAchievements);
    return achievement;
  }
  async addFriend(userId, friendId) {
    const user = await this.getUser(userId);
    const friend = await this.getUser(friendId);
    if (!user || !friend) throw new Error("User or friend not found");
    const key = `${userId}-${friendId}`;
    const existingFriendship = this.friendships.get(key);
    if (existingFriendship) {
      return existingFriendship;
    }
    const friendship = {
      id: Date.now(),
      userId,
      friendId,
      status: "pending",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.friendships.set(key, friendship);
    return friendship;
  }
  async acceptFriendRequest(userId, friendId) {
    const key = `${friendId}-${userId}`;
    const friendship = this.friendships.get(key);
    if (!friendship) throw new Error("Friend request not found");
    if (friendship.status !== "pending") throw new Error("Friend request is not pending");
    const updatedFriendship = {
      ...friendship,
      status: "accepted"
    };
    this.friendships.set(key, updatedFriendship);
    return updatedFriendship;
  }
  async getFriends(userId) {
    return [];
  }
  async getFriendRequests(userId) {
    return [];
  }
  async createLeague(league) {
    const id = this.currentLeagueId++;
    const newLeague = {
      id,
      name: league.name,
      creatorId: league.creatorId,
      description: league.description || null,
      isPublic: league.isPublic !== false,
      memberLimit: league.memberLimit || 50,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.leagues.set(id, newLeague);
    return newLeague;
  }
  async getLeagues() {
    return Array.from(this.leagues.values());
  }
  async joinLeague(leagueId, userId) {
    const member = {
      id: Date.now(),
      leagueId,
      userId,
      role: "member",
      joinedAt: /* @__PURE__ */ new Date()
    };
    const key = `${leagueId}-${userId}`;
    this.leagueMembers.set(key, member);
    return member;
  }
  async leaveLeague(leagueId, userId) {
    const key = `${leagueId}-${userId}`;
    this.leagueMembers.delete(key);
  }
  async getUserLeagues(userId) {
    const userLeagueIds = /* @__PURE__ */ new Set();
    for (const member of this.leagueMembers.values()) {
      if (member.userId === userId) {
        userLeagueIds.add(member.leagueId);
      }
    }
    const userLeagues = [];
    for (const leagueId of userLeagueIds) {
      const league = this.leagues.get(leagueId);
      if (league) {
        userLeagues.push(league);
      }
    }
    return userLeagues;
  }
  async getLeague(leagueId) {
    return this.leagues.get(leagueId);
  }
  async getLeagueMembers(leagueId) {
    const members = [];
    for (const member of this.leagueMembers.values()) {
      if (member.leagueId === leagueId) {
        const user = this.users.get(member.userId);
        if (user) {
          members.push(user);
        }
      }
    }
    return members;
  }
  async addLeagueMember(leagueId, userId) {
    return this.joinLeague(leagueId, userId);
  }
  async trackAnalytics(userId, event, data) {
  }
  async checkTrophyUnlocks(userId) {
  }
  async getUserTrophies(userId) {
    return this.trophies.get(userId) || [];
  }
  async awardTrophy(userId, trophy) {
    const userTrophies2 = this.trophies.get(userId) || [];
    const newTrophy = {
      id: Date.now(),
      userId,
      name: trophy.name,
      description: trophy.description,
      category: trophy.category,
      rarity: trophy.rarity,
      icon: trophy.icon,
      earnedAt: /* @__PURE__ */ new Date(),
      ...trophy
    };
    userTrophies2.push(newTrophy);
    this.trophies.set(userId, userTrophies2);
    return newTrophy;
  }
  async checkAndAwardTrophies(userId) {
    const user = await this.getUser(userId);
    const userChallenges = await this.getUserChallenges(userId);
    const userTrophies2 = await this.getUserTrophies(userId);
    const newTrophies = [];
    if (!user) return newTrophies;
    const trophyChecks = [
      {
        condition: user.wins >= 1,
        trophy: { name: "First Victory", description: "Won your first challenge", category: "achievement", rarity: "common", icon: "\u{1F3C6}" },
        id: "first_victory"
      },
      {
        condition: user.wins >= 5,
        trophy: { name: "Rising Star", description: "Won 5 challenges", category: "achievement", rarity: "uncommon", icon: "\u2B50" },
        id: "rising_star"
      },
      {
        condition: user.wins >= 10,
        trophy: { name: "Challenge Master", description: "Won 10 challenges", category: "achievement", rarity: "rare", icon: "\u{1F3C5}" },
        id: "challenge_master"
      },
      {
        condition: user.winStreak >= 3,
        trophy: { name: "On Fire", description: "Won 3 challenges in a row", category: "streak", rarity: "uncommon", icon: "\u{1F525}" },
        id: "on_fire"
      },
      {
        condition: user.winStreak >= 5,
        trophy: { name: "Unstoppable", description: "Won 5 challenges in a row", category: "streak", rarity: "rare", icon: "\u26A1" },
        id: "unstoppable"
      },
      {
        condition: userChallenges.filter((c) => c.challengeType === "community" && c.winnerId === userId).length >= 1,
        trophy: { name: "Community Champion", description: "Won a community challenge", category: "community", rarity: "uncommon", icon: "\u{1F31F}" },
        id: "community_champion"
      },
      {
        condition: userChallenges.filter((c) => c.challengeType === "community" && c.winnerId === userId).length >= 3,
        trophy: { name: "Community Legend", description: "Won 3 community challenges", category: "community", rarity: "rare", icon: "\u{1F451}" },
        id: "community_legend"
      },
      {
        condition: user.challengesCompleted >= 10,
        trophy: { name: "Dedicated Challenger", description: "Completed 10 challenges", category: "participation", rarity: "common", icon: "\u{1F4AA}" },
        id: "dedicated_challenger"
      },
      {
        condition: user.score >= 1e3,
        trophy: { name: "Point Accumulator", description: "Earned 1000 points", category: "points", rarity: "uncommon", icon: "\u{1F4B0}" },
        id: "point_accumulator"
      },
      {
        condition: user.score >= 5e3,
        trophy: { name: "Score Master", description: "Earned 5000 points", category: "points", rarity: "rare", icon: "\u{1F48E}" },
        id: "score_master"
      }
    ];
    for (const check of trophyChecks) {
      if (check.condition && !userTrophies2.some((t) => t.id === check.id)) {
        const newTrophy = await this.awardTrophy(userId, { ...check.trophy, id: check.id });
        newTrophies.push(newTrophy);
      }
    }
    return newTrophies;
  }
  async addLeagueMember(leagueId, userId) {
    return this.joinLeague(leagueId, userId);
  }
  async init() {
  }
  async createAvatar(avatar) {
    return {};
  }
  async updateAvatar(userId, updates) {
    if (!this.avatars) {
      this.avatars = /* @__PURE__ */ new Map();
    }
    const existingAvatar = this.avatars.get(userId);
    const avatar = {
      id: existingAvatar?.id || this.currentAvatarId++,
      userId,
      skinTone: updates.skinTone || "medium",
      faceShape: updates.faceShape || "oval",
      hairStyle: updates.hairStyle || "short",
      hairColor: updates.hairColor || "brown",
      eyeShape: updates.eyeShape || "round",
      eyeColor: updates.eyeColor || "brown",
      eyebrows: updates.eyebrows || "normal",
      nose: updates.nose || "medium",
      mouth: updates.mouth || "smile",
      facialHair: updates.facialHair || "none",
      createdAt: existingAvatar?.createdAt || /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.avatars.set(userId, avatar);
    return avatar;
  }
  async getUserAvatar(userId) {
    if (!this.avatars) {
      this.avatars = /* @__PURE__ */ new Map();
    }
    return this.avatars.get(userId);
  }
  async createEmote(emote) {
    return {};
  }
  async getEmotes() {
    return [];
  }
  async createShopItem(item) {
    return {};
  }
  async getShopItems() {
    return [];
  }
  async addUserInventory(userId, itemId) {
    return {};
  }
  async getUserInventory(userId) {
    return [];
  }
  async getUserLeagues(userId) {
    const userLeagueMembers = Array.from(this.leagueMembers.values()).filter(
      (member) => member.userId === userId
    );
    const leagueIds = userLeagueMembers.map((member) => member.leagueId);
    return Array.from(this.leagues.values()).filter(
      (league) => leagueIds.includes(league.id)
    );
  }
  async getChallengeResults(challengeId) {
    const result = this.challengeResults.get(challengeId);
    return result ? [result] : [];
  }
  async createCommunityChallenge(challenge) {
    const communityChallenge = {
      ...challenge,
      status: "community",
      challengeType: "community"
    };
    return this.createChallenge(communityChallenge);
  }
  async getCommunityBattles() {
    const allChallenges = Array.from(this.challenges.values());
    return allChallenges.filter((c) => c.challengeType === "community");
  }
  async joinCommunityBattle(challengeId, userId) {
    return this.acceptChallenge(challengeId, userId);
  }
  // Additional missing methods for routes
  async getChallengeEmotes(challengeId) {
    return Array.from(this.challengeEmotes.values()).filter((ce) => ce.challengeId === challengeId);
  }
  async sendChallengeEmote(challengeId, userId, emoteId) {
    const id = this.currentChallengeEmoteId++;
    const challengeEmote = {
      id,
      challengeId,
      userId,
      emoteId,
      sentAt: /* @__PURE__ */ new Date()
    };
    this.challengeEmotes.set(id, challengeEmote);
    return challengeEmote;
  }
  async submitChallengeResult(challengeId, userId, result, evidence) {
    const id = this.currentChallengeResultId++;
    const challengeResult = {
      id,
      challengeId,
      userId,
      result,
      evidence: evidence || null,
      submittedAt: /* @__PURE__ */ new Date()
    };
    this.challengeResults.set(challengeId, challengeResult);
    return challengeResult;
  }
  async verifyChallengeResults(challengeId) {
    const result = this.challengeResults.get(challengeId);
    if (result) {
      await this.updateChallengeStatus(challengeId, "reward_waiting");
    }
  }
  async createOrUpdateAvatar(userId, avatarData) {
    return this.updateAvatar(userId, avatarData);
  }
  async getAllItems() {
    return Array.from(this.items.values());
  }
  async getCurrentShopRotation() {
    return this.getShopItems();
  }
  async hasItemInInventory(userId, itemId) {
    const userInventory = await this.getUserInventory(userId);
    return userInventory.some((item) => item.itemId === itemId);
  }
  async purchaseItem(userId, itemId) {
    return this.addUserInventory(userId, itemId);
  }
  async removeLeagueMember(leagueId, userId) {
    const key = `${leagueId}-${userId}`;
    this.leagueMembers.delete(key);
  }
  async sendLeagueMessage(leagueId, userId, message) {
    const id = this.currentLeagueMessageId++;
    const leagueMessage = {
      id,
      leagueId,
      userId,
      message,
      sentAt: /* @__PURE__ */ new Date()
    };
    const messages = this.leagueMessages.get(leagueId) || [];
    messages.push(leagueMessage);
    this.leagueMessages.set(leagueId, messages);
    return leagueMessage;
  }
  async getLeagueMessages(leagueId) {
    return this.leagueMessages.get(leagueId) || [];
  }
  async createLeagueChallenge(challengeData) {
    return this.createChallenge(challengeData);
  }
  // Additional missing methods for routes
  async getGlobalLeaderboard() {
    const users2 = Array.from(this.users.values()).sort((a, b) => b.score - a.score).slice(0, 50);
    return users2.map((user) => ({
      id: user.id,
      username: user.username,
      score: user.score,
      wins: user.wins,
      losses: user.losses
    }));
  }
  async getFriendsLeaderboard(userId) {
    return this.getGlobalLeaderboard();
  }
  async declineFriendRequest(requestId) {
    this.friendRequests.delete(requestId);
  }
  async removeFriend(userId, friendId) {
    const key1 = `${userId}-${friendId}`;
    const key2 = `${friendId}-${userId}`;
    this.friendships.delete(key1);
    this.friendships.delete(key2);
  }
  async createFriendship(userId, friendId) {
    const friendship = {
      id: Date.now(),
      userId,
      friendId,
      status: "accepted",
      createdAt: /* @__PURE__ */ new Date()
    };
    const key = `${userId}-${friendId}`;
    this.friendships.set(key, friendship);
    return friendship;
  }
  async getLeague(leagueId) {
    return this.leagues.get(leagueId);
  }
  async getLeagueMembers(leagueId) {
    const members = Array.from(this.leagueMembers.values()).filter((m) => m.leagueId === leagueId);
    const membersWithUserData = [];
    for (const member of members) {
      const user = await this.getUser(member.userId);
      if (user) {
        membersWithUserData.push({
          ...user,
          memberId: member.id,
          role: member.role,
          joinedAt: member.joinedAt
        });
      }
    }
    return membersWithUserData;
  }
  async getLeagueChallenges(leagueId) {
    return Array.from(this.challenges.values()).filter((c) => c.leagueId === leagueId);
  }
  async addItemToInventory(userId, itemId) {
    return this.addUserInventory(userId, itemId);
  }
  async updateUserTokens(userId, tokens) {
    const user = this.users.get(userId);
    if (user) {
      user.score = tokens;
      this.users.set(userId, user);
    }
  }
  async getUserInventoryItems(userId) {
    return this.getUserInventory(userId);
  }
  async equipItem(userId, itemId) {
    return { success: true };
  }
  async unequipItem(userId, itemId) {
    return { success: true };
  }
  async getEquippedItems(userId) {
    return [];
  }
  async getAllEmotes() {
    return this.getEmotes();
  }
  async getUserEmotes(userId) {
    return [];
  }
  async unlockEmote(userId, emoteId) {
    return { success: true };
  }
  async getAvatar(userId) {
    return this.getUserAvatar(userId);
  }
  async getCustomEmotes(userId) {
    return [];
  }
  async createCustomEmote(userId, emoteData) {
    return emoteData;
  }
  // Challenge invitation methods
  async createChallengeInvitation(invitation) {
    const id = this.currentInvitationId++;
    const newInvitation = {
      id,
      challengeId: invitation.challengeId,
      inviterId: invitation.inviterId,
      inviteeId: invitation.inviteeId,
      status: "pending",
      message: invitation.message || null,
      sentAt: /* @__PURE__ */ new Date(),
      respondedAt: null
    };
    this.challengeInvitations.set(id, newInvitation);
    return newInvitation;
  }
  async getUserChallengeInvitations(userId) {
    return Array.from(this.challengeInvitations.values()).filter(
      (invitation) => invitation.inviteeId === userId && invitation.status === "pending"
    );
  }
  async acceptChallengeInvitation(invitationId) {
    const invitation = this.challengeInvitations.get(invitationId);
    if (!invitation) {
      throw new Error("Invitation not found");
    }
    const updatedInvitation = {
      ...invitation,
      status: "accepted",
      respondedAt: /* @__PURE__ */ new Date()
    };
    this.challengeInvitations.set(invitationId, updatedInvitation);
    await this.addChallengeParticipant(invitation.challengeId, invitation.inviteeId);
    return updatedInvitation;
  }
  async declineChallengeInvitation(invitationId) {
    const invitation = this.challengeInvitations.get(invitationId);
    if (!invitation) {
      throw new Error("Invitation not found");
    }
    const updatedInvitation = {
      ...invitation,
      status: "declined",
      respondedAt: /* @__PURE__ */ new Date()
    };
    this.challengeInvitations.set(invitationId, updatedInvitation);
    return updatedInvitation;
  }
  async addChallengeParticipant(challengeId, userId, role = "participant") {
    const id = this.currentParticipantId++;
    const participant = {
      id,
      challengeId,
      userId,
      joinedAt: /* @__PURE__ */ new Date(),
      role
    };
    const participants = this.challengeParticipants.get(challengeId) || [];
    participants.push(participant);
    this.challengeParticipants.set(challengeId, participants);
    return participant;
  }
  async getChallengeParticipants(challengeId) {
    return this.challengeParticipants.get(challengeId) || [];
  }
};
var storage = new MemStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, primaryKey, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  score: integer("score").notNull().default(0),
  // Leaderboard score based on wins
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  winStreak: integer("win_streak").notNull().default(0),
  maxWinStreak: integer("max_win_streak").notNull().default(0),
  challengesCompleted: integer("challenges_completed").notNull().default(0),
  lastActiveAt: timestamp("last_active_at").notNull().defaultNow()
});
var challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("open"),
  // open, accepted, completed, reward_waiting, disputed
  challengeType: text("challenge_type").notNull(),
  // sports, gaming, fitness, casual, trivia
  acceptorId: integer("acceptor_id"),
  winnerId: integer("winner_id"),
  prizeAmount: text("prize_amount"),
  // Agreed prize amount (metadata only, not processed)
  isPublic: boolean("is_public").notNull().default(true),
  isSponsored: boolean("is_sponsored").notNull().default(false),
  sponsorName: text("sponsor_name"),
  sponsorLogo: text("sponsor_logo"),
  rewardType: text("reward_type").notNull().default("score"),
  // score, trophy, emote
  rewardValue: text("reward_value"),
  // trophy_id, emote_id, or score amount
  creatorVerifiedReward: boolean("creator_verified_reward").notNull().default(false),
  acceptorVerifiedReward: boolean("acceptor_verified_reward").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var trophies = pgTable("trophies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  // milestone, streak, special
  iconUrl: text("icon_url").notNull(),
  requirement: text("requirement").notNull(),
  // e.g., "5_win_streak", "25_total_wins"
  rarity: text("rarity").notNull().default("common"),
  // common, rare, epic, legendary
  isVisible: boolean("is_visible").notNull().default(true)
});
var userTrophies = pgTable("user_trophies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  trophyId: integer("trophy_id").notNull().references(() => trophies.id),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  progress: integer("progress").notNull().default(0)
});
var achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  // first_win, challenge_streak, trophy_unlock, emote_unlock
  data: text("data"),
  // JSON string with achievement data
  earnedAt: timestamp("earned_at").notNull().defaultNow()
});
var challengeInvitations = pgTable("challenge_invitations", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  inviterId: integer("inviter_id").notNull().references(() => users.id),
  inviteeId: integer("invitee_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"),
  // pending, accepted, declined, expired
  message: text("message"),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
  respondedAt: timestamp("responded_at")
});
var challengeParticipants = pgTable("challenge_participants", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  userId: integer("user_id").notNull().references(() => users.id),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  role: text("role").notNull().default("participant")
  // creator, participant
});
var avatars = pgTable("avatars", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  // Basic appearance
  skinTone: text("skin_tone").notNull().default("medium"),
  faceShape: text("face_shape").notNull().default("oval"),
  hairStyle: text("hair_style").notNull().default("short"),
  hairColor: text("hair_color").notNull().default("brown"),
  eyeShape: text("eye_shape").notNull().default("normal"),
  eyeColor: text("eye_color").notNull().default("brown"),
  eyebrows: text("eyebrows").notNull().default("normal"),
  nose: text("nose").notNull().default("normal"),
  mouth: text("mouth").notNull().default("normal"),
  // Purchasable clothing and accessories
  equippedShirt: integer("equipped_shirt").references(() => items.id),
  equippedPants: integer("equipped_pants").references(() => items.id),
  equippedShoes: integer("equipped_shoes").references(() => items.id),
  equippedHat: integer("equipped_hat").references(() => items.id),
  equippedGlasses: integer("equipped_glasses").references(() => items.id),
  equippedAccessory: integer("equipped_accessory").references(() => items.id),
  equippedJewelry: integer("equipped_jewelry").references(() => items.id),
  equippedBackground: integer("equipped_background").references(() => items.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  // shirt, pants, shoes, hat, glasses, accessory, jewelry, background
  rarity: text("rarity").notNull(),
  // common, rare, epic, legendary
  price: integer("price").notNull().default(0),
  // Points cost
  imageUrl: text("image_url").notNull(),
  previewUrl: text("preview_url"),
  // Preview image showing the item on avatar
  colorVariants: text("color_variants").array(),
  // Available color options
  isAvailable: boolean("is_available").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  itemId: integer("item_id").notNull().references(() => items.id),
  purchasedAt: timestamp("purchased_at").notNull().defaultNow(),
  selectedColor: text("selected_color"),
  // Chosen color variant
  isActive: boolean("is_active").notNull().default(false)
  // Currently equipped
});
var insertAvatarSchema = createInsertSchema(avatars).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true
});
var insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  purchasedAt: true
});
var emotes = pgTable("emotes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  emoji: text("emoji").notNull(),
  category: text("category").notNull().default("general"),
  isUnlocked: boolean("is_unlocked").notNull().default(true),
  unlockRequirement: text("unlock_requirement")
  // e.g., "10_wins", "first_challenge"
});
var userEmotes = pgTable("user_emotes", {
  userId: integer("user_id").notNull(),
  emoteId: integer("emote_id").notNull(),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow()
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.emoteId] })
  };
});
var challengeEmotes = pgTable("challenge_emotes", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").notNull(),
  userId: integer("user_id").notNull(),
  emoteId: integer("emote_id").notNull(),
  sentAt: timestamp("sent_at").notNull().defaultNow()
});
var challengeResults = pgTable("challenge_results", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").notNull(),
  userId: integer("user_id").notNull(),
  result: text("result").notNull(),
  evidence: text("evidence"),
  // photo/video URL
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  isVerified: boolean("is_verified").notNull().default(false)
});
var leaderboards = pgTable("leaderboards", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  // global, friends, weekly, monthly
  periodStart: timestamp("period_start").notNull().defaultNow(),
  periodEnd: timestamp("period_end"),
  isActive: boolean("is_active").notNull().default(true)
});
var leaderboardEntries = pgTable("leaderboard_entries", {
  id: serial("id").primaryKey(),
  leaderboardId: integer("leaderboard_id").notNull().references(() => leaderboards.id),
  userId: integer("user_id").notNull().references(() => users.id),
  score: integer("score").notNull().default(0),
  rank: integer("rank").notNull(),
  wins: integer("wins").notNull().default(0),
  winStreak: integer("win_streak").notNull().default(0),
  challengesCompleted: integer("challenges_completed").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  eventType: text("event_type").notNull(),
  // challenge_created, challenge_joined, challenge_won, emote_unlocked, trophy_earned
  eventData: text("event_data"),
  // JSON string with event-specific data
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var friendships = pgTable("friendships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  friendId: integer("friend_id").notNull(),
  status: text("status").notNull().default("pending"),
  // pending, accepted, blocked
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var leagues = pgTable("leagues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isPublic: boolean("is_public").notNull().default(true),
  creatorId: integer("creator_id").notNull(),
  memberLimit: integer("member_limit").notNull().default(100),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var leagueMembers = pgTable("league_members", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").notNull(),
  userId: integer("user_id").notNull(),
  role: text("role").notNull().default("member"),
  // member, admin, owner
  joinedAt: timestamp("joined_at").notNull().defaultNow()
});
var leagueMessages = pgTable("league_messages", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").notNull(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  sentAt: timestamp("sent_at").notNull().defaultNow()
});
var insertUserSchema = createInsertSchema(users);
var insertChallengeSchema = createInsertSchema(challenges);
var insertLeagueSchema = createInsertSchema(leagues);
var insertFriendshipSchema = createInsertSchema(friendships);
var insertLeagueMemberSchema = createInsertSchema(leagueMembers);
var insertChallengeEmoteSchema = createInsertSchema(challengeEmotes);
var emotesTable = pgTable("emotes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(),
  // happy, victory, taunt, dance, etc.
  rarity: varchar("rarity", { length: 20 }).notNull(),
  // common, rare, epic, legendary
  price: integer("price").notNull(),
  animation: varchar("animation", { length: 100 }).notNull(),
  // CSS animation class or identifier
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var userEmotesTable = pgTable("user_emotes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  emoteId: integer("emote_id").references(() => emotesTable.id, { onDelete: "cascade" }).notNull(),
  purchasedAt: timestamp("purchased_at").defaultNow().notNull()
});
var equippedEmotesTable = pgTable("equipped_emotes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  emoteId: integer("emote_id").references(() => emotesTable.id, { onDelete: "cascade" }).notNull(),
  slot: integer("slot").notNull(),
  // 0-7 for 8 emote slots
  equippedAt: timestamp("equipped_at").defaultNow().notNull()
});
var insertEmoteSchema = createInsertSchema(emotesTable).omit({
  id: true,
  createdAt: true
});
var insertUserEmoteSchema = createInsertSchema(userEmotesTable).omit({
  id: true,
  purchasedAt: true
});
var insertEquippedEmoteSchema = createInsertSchema(equippedEmotesTable).omit({
  id: true,
  equippedAt: true
});

// server/auth.ts
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "face-off-dev-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: false,
      // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1e3,
      // 24 hours
      sameSite: "lax"
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json(result.error);
      }
      const existingUser = await storage.getUserByUsername(result.data.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const existingEmail = await storage.getUserByEmail(result.data.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const user = await storage.createUser({
        ...result.data,
        password: await hashPassword(result.data.password)
      });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      next(err);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    console.log("Login attempt:", req.body);
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.log("Login error:", err);
        return next(err);
      }
      if (!user) {
        console.log("Login failed for user:", req.body.username);
        return res.status(401).json({ message: "Invalid username or password" });
      }
      req.login(user, (err2) => {
        if (err2) {
          console.log("Session error:", err2);
          return next(err2);
        }
        const { password, ...safeUser } = user;
        console.log("Login successful for user:", user.username);
        res.json(safeUser);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...safeUser } = req.user;
    res.json(safeUser);
  });
}

// server/routes.ts
function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  next();
}
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.get("/api/users", async (req, res) => {
    const allUsers = await storage.getAllUsers();
    const sanitizedUsers = allUsers.map(({ password, ...user }) => user);
    res.json(sanitizedUsers);
  });
  app2.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(parseInt(req.params.id));
    if (!user) return res.status(404).send("User not found");
    const { password, ...sanitizedUser } = user;
    res.json(sanitizedUser);
  });
  app2.get("/api/challenges", async (req, res) => {
    const status = req.query.status;
    const challenges2 = await storage.getChallenges(status);
    res.json(challenges2);
  });
  app2.get("/api/community-challenges", async (req, res) => {
    try {
      const challenges2 = await storage.getCommunityBattles();
      const userId = req.isAuthenticated() ? req.user.id : null;
      const communitychallenges = userId ? challenges2.filter((c) => c.creatorId !== userId) : challenges2;
      res.json(communitychallenges);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  app2.post("/api/community-challenges", requireAuth, async (req, res) => {
    try {
      const challengeData = {
        ...req.body,
        creatorId: req.user.id,
        challengeType: "community"
      };
      const challenge = await storage.createCommunityChallenge(challengeData);
      res.json(challenge);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/challenges", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { title, description, challengeType, prizeAmount } = req.body;
    if (!title || !description || !challengeType) {
      return res.status(400).json({ error: "Missing required fields: title, description, challengeType" });
    }
    if (description.length < 1) {
      return res.status(400).json({ error: "Description is required" });
    }
    try {
      const challenge = await storage.createChallenge({
        title,
        description,
        challengeType,
        prizeAmount: prizeAmount || null,
        creatorId: req.user.id,
        isPublic: true
      });
      if (req.body.invitedFriends && req.body.invitedFriends.length > 0) {
        for (const friendId of req.body.invitedFriends) {
          await storage.createChallengeInvitation({
            challengeId: challenge.id,
            inviterId: req.user.id,
            inviteeId: friendId,
            message: `${req.user.username} has invited you to join their challenge: "${challenge.title}"`
          });
        }
      }
      try {
        await storage.trackAnalytics(req.user.id, "challenge_created", JSON.stringify({
          challengeId: challenge.id,
          challengeType: challenge.challengeType,
          isPublic: challenge.isPublic,
          invitedFriends: req.body.invitedFriends?.length || 0
        }));
      } catch (analyticsError) {
        console.log("Analytics tracking failed:", analyticsError);
      }
      res.status(201).json(challenge);
    } catch (error) {
      console.error("Challenge creation error:", error);
      res.status(500).json({ error: "Failed to create challenge" });
    }
  });
  app2.post("/api/challenges/:id/accept", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const challenge = await storage.getChallenge(parseInt(req.params.id));
    if (!challenge) return res.status(404).send("Challenge not found");
    if (challenge.challengeType === "community") {
      const updatedChallenge2 = await storage.acceptChallenge(challenge.id, req.user.id);
      res.json(updatedChallenge2);
      return;
    }
    if (challenge.status !== "open") return res.status(400).send("Challenge is not open");
    if (challenge.creatorId === req.user.id) return res.status(400).send("Cannot accept your own challenge");
    const updatedChallenge = await storage.acceptChallenge(challenge.id, req.user.id);
    await storage.trackAnalytics(req.user.id, "challenge_joined", JSON.stringify({
      challengeId: challenge.id,
      challengeType: challenge.challengeType
    }));
    res.json(updatedChallenge);
  });
  app2.post("/api/challenges/:id/complete", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { winnerId } = req.body;
    if (!winnerId) return res.status(400).send("Winner ID is required");
    const challenge = await storage.getChallenge(parseInt(req.params.id));
    if (!challenge) return res.status(404).send("Challenge not found");
    if (challenge.status !== "accepted") return res.status(400).send("Challenge must be accepted first");
    if (req.user.id !== challenge.creatorId && req.user.id !== challenge.acceptorId) {
      return res.status(403).send("Only participants can mark a challenge as complete");
    }
    const winner = await storage.getUser(winnerId);
    if (!winner) return res.status(404).send("Winner not found");
    if (winnerId != challenge.creatorId && winnerId != challenge.acceptorId) {
      return res.status(400).send("Winner must be a participant in the challenge");
    }
    const status = challenge.prizeAmount ? "reward_waiting" : "completed";
    const updatedChallenge = await storage.updateChallengeStatus(challenge.id, status, winnerId);
    const loserId = winnerId === challenge.creatorId ? challenge.acceptorId : challenge.creatorId;
    const winnerUser = await storage.getUser(winnerId);
    const loserUser = await storage.getUser(loserId);
    if (winnerUser && loserUser) {
      await storage.updateUserWins(winnerId, winnerUser.wins + 1);
      await storage.updateUserLosses(loserId, loserUser.losses + 1);
      const newWinStreak = winnerUser.winStreak + 1;
      await storage.updateUserWinStreak(winnerId, newWinStreak);
      await storage.updateUserWinStreak(loserId, 0);
      if (newWinStreak > winnerUser.maxWinStreak) {
        await storage.updateUserMaxWinStreak(winnerId, newWinStreak);
      }
      await storage.updateUserChallengesCompleted(winnerId, winnerUser.challengesCompleted + 1);
      await storage.updateUserChallengesCompleted(loserId, loserUser.challengesCompleted + 1);
      let scoreIncrease = 10;
      if (newWinStreak >= 5) scoreIncrease += 5;
      if (challenge.challengeType === "fitness") scoreIncrease += 3;
      await storage.updateUserScore(winnerId, winnerUser.score + scoreIncrease);
      await storage.checkTrophyUnlocks(winnerId);
      await storage.trackAnalytics(winnerId, "challenge_won", JSON.stringify({
        challengeId: challenge.id,
        scoreEarned: scoreIncrease,
        winStreak: newWinStreak
      }));
    }
    res.json(updatedChallenge);
  });
  app2.post("/api/challenges/:id/verify-reward", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const challenge = await storage.getChallenge(parseInt(req.params.id));
    if (!challenge) return res.status(404).send("Challenge not found");
    if (challenge.status !== "reward_waiting") return res.status(400).send("Challenge must be in reward waiting status");
    if (req.user.id !== challenge.creatorId && req.user.id !== challenge.acceptorId) {
      return res.status(403).send("Only participants can verify reward receipt");
    }
    const isCreator = req.user.id === challenge.creatorId;
    const updatedChallenge = await storage.updateRewardVerification(challenge.id, isCreator);
    if (updatedChallenge.creatorVerifiedReward && updatedChallenge.acceptorVerifiedReward) {
      await storage.updateChallengeStatus(challenge.id, "completed");
    }
    res.json(updatedChallenge);
  });
  app2.get("/api/leaderboard/global", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const leaderboard = await storage.getGlobalLeaderboard();
    res.json(leaderboard);
  });
  app2.get("/api/leaderboard/friends", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const leaderboard = await storage.getFriendsLeaderboard(req.user.id);
    res.json(leaderboard);
  });
  app2.get("/api/user/trophies", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const trophies2 = await storage.getUserTrophies(req.user.id);
    res.json(trophies2);
  });
  app2.get("/api/my-challenges", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const challenges2 = await storage.getUserChallenges(req.user.id);
    res.json(challenges2);
  });
  app2.get("/api/friends", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const friends = await storage.getFriends(req.user.id);
    res.json(friends);
  });
  app2.get("/api/friend-requests", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const requests = await storage.getFriendRequests(req.user.id);
    res.json(requests);
  });
  app2.post("/api/friends", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const result = insertFriendshipSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    const { friendId } = result.data;
    if (friendId === req.user.id) {
      return res.status(400).send("Cannot add yourself as a friend");
    }
    try {
      const friendship = await storage.addFriend(req.user.id, friendId);
      res.status(201).json(friendship);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  app2.post("/api/friend-requests/:id/accept", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const friendId = parseInt(req.params.id);
    try {
      const friendship = await storage.acceptFriendRequest(req.user.id, friendId);
      res.json(friendship);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  app2.post("/api/friend-requests/:id/decline", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const friendId = parseInt(req.params.id);
    try {
      const friendship = await storage.declineFriendRequest(req.user.id, friendId);
      res.json(friendship);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  app2.delete("/api/friends/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const friendId = parseInt(req.params.id);
    try {
      await storage.removeFriend(req.user.id, friendId);
      res.sendStatus(204);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  app2.post("/api/add-friend", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    const { friendUsername } = req.body;
    if (!friendUsername || friendUsername.trim().length === 0) {
      return res.status(400).json({ error: "Username is required" });
    }
    const allUsers = await storage.getAllUsers();
    const friendUser = allUsers.find(
      (u) => u.username.toLowerCase() === friendUsername.toLowerCase().trim()
    );
    if (!friendUser) {
      return res.status(404).json({ error: "Player not found. Make sure they have registered an account." });
    }
    if (friendUser.id === req.user.id) {
      return res.status(400).json({ error: "Cannot add yourself as friend" });
    }
    const existingFriendships = await storage.getFriends(req.user.id);
    const friendRequests = await storage.getFriendRequests(req.user.id);
    const alreadyFriends = existingFriendships.some((f) => f.user.id === friendUser.id);
    const requestExists = friendRequests.some((f) => f.user.id === friendUser.id);
    if (alreadyFriends) {
      return res.status(400).json({ error: "You are already friends with this player" });
    }
    if (requestExists) {
      return res.status(400).json({ error: "Friend request already sent to this player" });
    }
    try {
      const friendship = await storage.createFriendship(req.user.id, friendUser.id);
      res.status(201).json({
        message: `Friend request sent to ${friendUser.username}`,
        friendship
      });
    } catch (error) {
      console.error("Error creating friendship:", error);
      res.status(500).json({ error: "Failed to send friend request" });
    }
  });
  app2.get("/api/search-players", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    const { query } = req.query;
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return res.json([]);
    }
    try {
      const allUsers = await storage.getAllUsers();
      const searchTerm = query.toLowerCase().trim();
      const matchingUsers = allUsers.filter(
        (user) => user.id !== req.user.id && user.username.toLowerCase().includes(searchTerm)
      ).slice(0, 10).map((user) => ({
        id: user.id,
        username: user.username,
        tokens: user.tokens,
        wins: user.wins,
        losses: user.losses
      }));
      res.json(matchingUsers);
    } catch (error) {
      console.error("Error searching players:", error);
      res.status(500).json({ error: "Failed to search players" });
    }
  });
  app2.get("/api/leagues", async (req, res) => {
    try {
      const leagues2 = await storage.getLeagues();
      res.json(leagues2);
    } catch (error) {
      console.error("Error fetching leagues:", error);
      res.json([]);
    }
  });
  app2.get("/api/my-leagues", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const leagues2 = await storage.getUserLeagues(req.user.id);
    res.json(leagues2);
  });
  app2.get("/api/leagues/:id", async (req, res) => {
    const leagueId = parseInt(req.params.id);
    const league = await storage.getLeague(leagueId);
    if (!league) {
      return res.status(404).send("League not found");
    }
    res.json(league);
  });
  app2.get("/api/leagues/:id/members", async (req, res) => {
    const leagueId = parseInt(req.params.id);
    try {
      const members = await storage.getLeagueMembers(leagueId);
      const sanitizedMembers = members.map(({ password, ...user }) => user);
      res.json(sanitizedMembers);
    } catch (error) {
      res.status(404).send(error.message);
    }
  });
  app2.post("/api/leagues", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const result = insertLeagueSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    try {
      const league = await storage.createLeague({
        ...result.data,
        creatorId: req.user.id
      });
      res.status(201).json(league);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  app2.post("/api/leagues/:id/members", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const leagueId = parseInt(req.params.id);
    const userId = req.body.userId || req.user.id;
    try {
      const members = await storage.getLeagueMembers(leagueId);
      const isAlreadyMember = members.some((member) => member.id === userId);
      if (isAlreadyMember) {
        return res.status(400).json({ error: "Already a member of this league" });
      }
      const membership = await storage.addLeagueMember(leagueId, userId);
      res.status(201).json(membership);
    } catch (error) {
      console.error("League join error:", error);
      res.status(400).json({ error: error.message || "Failed to join league" });
    }
  });
  app2.post("/api/challenges/:id/invite", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const challengeId = parseInt(req.params.id);
      const { userId, message } = req.body;
      const invitation = await storage.createChallengeInvitation({
        challengeId,
        inviterId: req.user.id,
        inviteeId: userId,
        message
      });
      res.status(201).json(invitation);
    } catch (error) {
      console.error("Error sending challenge invitation:", error);
      res.status(500).json({ error: "Failed to send invitation" });
    }
  });
  app2.get("/api/challenge-invitations", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const invitations = await storage.getUserChallengeInvitations(req.user.id);
      res.json(invitations);
    } catch (error) {
      console.error("Error fetching challenge invitations:", error);
      res.status(500).json({ error: "Failed to fetch invitations" });
    }
  });
  app2.post("/api/challenge-invitations/:id/accept", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const invitationId = parseInt(req.params.id);
      const invitation = await storage.acceptChallengeInvitation(invitationId);
      res.json(invitation);
    } catch (error) {
      console.error("Error accepting challenge invitation:", error);
      res.status(500).json({ error: "Failed to accept invitation" });
    }
  });
  app2.post("/api/challenge-invitations/:id/decline", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const invitationId = parseInt(req.params.id);
      const invitation = await storage.declineChallengeInvitation(invitationId);
      res.json(invitation);
    } catch (error) {
      console.error("Error declining challenge invitation:", error);
      res.status(500).json({ error: "Failed to decline invitation" });
    }
  });
  app2.get("/api/challenges/:id/participants", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const challengeId = parseInt(req.params.id);
      const participants = await storage.getChallengeParticipants(challengeId);
      res.json(participants);
    } catch (error) {
      console.error("Error fetching challenge participants:", error);
      res.status(500).json({ error: "Failed to fetch participants" });
    }
  });
  app2.delete("/api/leagues/:leagueId/members/:userId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const leagueId = parseInt(req.params.leagueId);
    const userId = parseInt(req.params.userId);
    try {
      await storage.removeLeagueMember(leagueId, userId);
      res.sendStatus(204);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  app2.get("/api/avatar", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const avatar = await storage.getUserAvatar(req.user.id);
    res.json(avatar);
  });
  app2.get("/api/users/:id/avatar", async (req, res) => {
    const userId = parseInt(req.params.id);
    const avatar = await storage.getUserAvatar(userId);
    res.json(avatar);
  });
  app2.post("/api/avatar", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const result = insertAvatarSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }
    try {
      const avatar = await storage.createOrUpdateAvatar(req.user.id, result.data);
      res.json(avatar);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  app2.get("/api/items", async (req, res) => {
    try {
      const items2 = await storage.getAllItems();
      res.json(items2);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  app2.get("/api/shop", async (req, res) => {
    try {
      const shopItems = await storage.getCurrentShopRotation();
      res.json(shopItems);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  app2.post("/api/shop/purchase", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ error: "Item ID is required" });
    }
    try {
      const shopItems = await storage.getCurrentShopRotation();
      const shopItem = shopItems.find((item) => item.itemId === itemId);
      if (!shopItem) {
        return res.status(400).json({ error: "Item not available in shop" });
      }
      const user = await storage.getUser(req.user.id);
      if (!user || user.tokens < shopItem.item.price) {
        return res.status(400).json({ error: "Insufficient tokens" });
      }
      const hasItem = await storage.hasItemInInventory(req.user.id, itemId);
      if (hasItem) {
        return res.status(400).json({ error: "Item already owned" });
      }
      await storage.addItemToInventory(req.user.id, itemId);
      await storage.updateUserTokens(req.user.id, -shopItem.item.price);
      res.json({ success: true, message: "Item purchased successfully" });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  app2.get("/api/inventory", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const inventory2 = await storage.getUserInventoryItems(req.user.id);
      res.json(inventory2);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  app2.post("/api/avatar/equip", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { itemId, slot } = req.body;
    if (!itemId || !slot) {
      return res.status(400).json({ error: "Item ID and slot are required" });
    }
    try {
      const avatar = await storage.equipItem(req.user.id, itemId, slot);
      res.json(avatar);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  app2.post("/api/avatar/unequip", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { slot } = req.body;
    if (!slot) {
      return res.status(400).json({ error: "Slot is required" });
    }
    try {
      const avatar = await storage.unequipItem(req.user.id, slot);
      res.json(avatar);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  app2.get("/api/avatar/equipped", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const equippedItems = await storage.getEquippedItems(req.user.id);
      res.json(equippedItems);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  app2.get("/api/emotes", async (req, res) => {
    const emotes2 = await storage.getAllEmotes();
    res.json(emotes2);
  });
  app2.get("/api/my-emotes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const emotes2 = await storage.getUserEmotes(req.user.id);
    res.json(emotes2);
  });
  app2.post("/api/emotes/:id/unlock", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const emoteId = parseInt(req.params.id);
    try {
      const userEmote = await storage.unlockEmote(req.user.id, emoteId);
      res.status(201).json(userEmote);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  app2.get("/api/challenges/:id/emotes", async (req, res) => {
    const challengeId = parseInt(req.params.id);
    try {
      const emotes2 = await storage.getChallengeEmotes(challengeId);
      res.json(emotes2);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  app2.post("/api/challenges/:id/emotes", requireAuth, async (req, res) => {
    try {
      const challengeId = parseInt(req.params.id);
      const { emoteId } = req.body;
      const userId = req.user.id;
      const challengeEmote = await storage.sendChallengeEmote(challengeId, userId, emoteId);
      res.json(challengeEmote);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/challenges/:id/results", requireAuth, async (req, res) => {
    try {
      const challengeId = parseInt(req.params.id);
      const { result, evidence } = req.body;
      const userId = req.user.id;
      const challengeResult = await storage.submitChallengeResult(challengeId, userId, result, evidence);
      await storage.verifyChallengeResults(challengeId);
      res.json(challengeResult);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/challenges/:id/results", requireAuth, async (req, res) => {
    try {
      const challengeId = parseInt(req.params.id);
      const results = await storage.getChallengeResults(challengeId);
      res.json(results);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/shop", requireAuth, async (req, res) => {
    try {
      const items2 = await storage.getShopItems();
      res.json(items2);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/shop/purchase", requireAuth, async (req, res) => {
    try {
      const { itemId } = req.body;
      const userId = req.user.id;
      const purchase = await storage.purchaseItem(userId, itemId);
      res.json(purchase);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/inventory", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const inventory2 = await storage.getUserInventory(userId);
      res.json(inventory2);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/leagues/:id/messages", requireAuth, async (req, res) => {
    try {
      const leagueId = parseInt(req.params.id);
      const { message } = req.body;
      const userId = req.user.id;
      if (!message || message.trim().length === 0) {
        return res.status(400).json({ error: "Message cannot be empty" });
      }
      const leagueMessage = await storage.sendLeagueMessage(leagueId, userId, message.trim());
      res.json(leagueMessage);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/leagues/:id/messages", requireAuth, async (req, res) => {
    try {
      const leagueId = parseInt(req.params.id);
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;
      const messages = await storage.getLeagueMessages(leagueId, limit);
      res.json(messages);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/community-challenges", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const allChallenges = await storage.getChallenges();
    const communityChallenges = allChallenges.filter((c) => c.status === "open").slice(0, 5);
    res.json(communityChallenges);
  });
  app2.get("/api/leagues/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const leagueId = parseInt(req.params.id);
    try {
      const league = await storage.getLeague(leagueId);
      if (!league) return res.sendStatus(404);
      res.json(league);
    } catch (error) {
      console.error("Error fetching league:", error);
      res.sendStatus(500);
    }
  });
  app2.get("/api/leagues/:id/challenges", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const leagueId = parseInt(req.params.id);
    try {
      const challenges2 = await storage.getLeagueChallenges(leagueId);
      res.json(challenges2);
    } catch (error) {
      console.error("Error fetching league challenges:", error);
      res.sendStatus(500);
    }
  });
  app2.get("/api/emotes/all", async (req, res) => {
    try {
      const sampleEmotes = [
        { id: 1, name: "Happy Dance", description: "Celebrate your victory!", category: "victory", rarity: "common", price: 50, animation: "dance-bounce" },
        { id: 2, name: "Sad Face", description: "When things don't go your way", category: "sad", rarity: "common", price: 30, animation: "shake" },
        { id: 3, name: "Fire Flex", description: "Show off your skills", category: "taunt", rarity: "rare", price: 100, animation: "fire-pulse" },
        { id: 4, name: "Heart Love", description: "Spread the love", category: "happy", rarity: "common", price: 40, animation: "heart-bounce" },
        { id: 5, name: "Thumbs Up", description: "Good job!", category: "victory", rarity: "common", price: 35, animation: "thumbs-wiggle" },
        { id: 6, name: "Star Power", description: "You're a star!", category: "victory", rarity: "epic", price: 200, animation: "star-sparkle" },
        { id: 7, name: "Trophy Celebration", description: "Ultimate victory!", category: "victory", rarity: "legendary", price: 500, animation: "trophy-glow" },
        { id: 8, name: "Laugh Out Loud", description: "That's hilarious!", category: "happy", rarity: "rare", price: 75, animation: "laugh-shake" }
      ];
      res.json(sampleEmotes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch emotes" });
    }
  });
  app2.get("/api/emotes/user", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const userEmotes2 = [
        { id: 1, userId: req.user.id, emoteId: 1, purchasedAt: /* @__PURE__ */ new Date(), emote: { id: 1, name: "Happy Dance", description: "Celebrate your victory!", category: "victory", rarity: "common", price: 50, animation: "dance-bounce" } },
        { id: 2, userId: req.user.id, emoteId: 4, purchasedAt: /* @__PURE__ */ new Date(), emote: { id: 4, name: "Heart Love", description: "Spread the love", category: "happy", rarity: "common", price: 40, animation: "heart-bounce" } }
      ];
      res.json(userEmotes2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user emotes" });
    }
  });
  app2.get("/api/emotes/equipped", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const equippedEmotes = [
        { id: 1, userId: req.user.id, emoteId: 1, slot: 0, equippedAt: /* @__PURE__ */ new Date(), emote: { id: 1, name: "Happy Dance", description: "Celebrate your victory!", category: "victory", rarity: "common", price: 50, animation: "dance-bounce" } }
      ];
      res.json(equippedEmotes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch equipped emotes" });
    }
  });
  app2.post("/api/emotes/purchase", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { emoteId } = req.body;
    try {
      res.json({ success: true, message: "Emote purchased successfully" });
    } catch (error) {
      res.status(400).json({ error: "Failed to purchase emote" });
    }
  });
  app2.post("/api/emotes/equip", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { emoteId } = req.body;
    try {
      res.json({ success: true, message: "Emote equipped successfully" });
    } catch (error) {
      res.status(400).json({ error: "Failed to equip emote" });
    }
  });
  app2.post("/api/emotes/unequip", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { emoteId } = req.body;
    try {
      res.json({ success: true, message: "Emote unequipped successfully" });
    } catch (error) {
      res.status(400).json({ error: "Failed to unequip emote" });
    }
  });
  app2.post("/api/leagues/:id/challenges", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const leagueId = parseInt(req.params.id);
    try {
      const challengeData = {
        ...req.body,
        creatorId: req.user.id,
        leagueId
      };
      const challenge = await storage.createLeagueChallenge(challengeData);
      res.json(challenge);
    } catch (error) {
      console.error("Error creating league challenge:", error);
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/trophies", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const trophies2 = await storage.getUserTrophies(userId);
      res.json(trophies2);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.post("/api/trophies/check", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const newTrophies = await storage.checkAndAwardTrophies(userId);
      res.json(newTrophies);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/avatar", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const avatar = await storage.getAvatar(req.user.id);
    res.json(avatar);
  });
  app2.put("/api/avatar", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const avatar = await storage.updateAvatar(req.user.id, req.body);
      res.json(avatar);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  app2.get("/api/custom-emotes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const emotes2 = await storage.getCustomEmotes(req.user.id);
    res.json(emotes2);
  });
  app2.post("/api/custom-emotes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const emote = await storage.createCustomEmote(req.user.id, req.body);
      res.status(201).json(emote);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  app2.post("/api/friend-requests", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { friendId } = req.body;
    if (!friendId) return res.status(400).send("Friend ID is required");
    if (friendId === req.user.id) {
      return res.status(400).send("Cannot send friend request to yourself");
    }
    try {
      res.status(201).json({ id: Date.now(), userId: req.user.id, friendId, status: "pending" });
    } catch (error) {
      res.status(500).json({ error: "Failed to send friend request" });
    }
  });
  app2.get("/api/friend-requests", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json([]);
  });
  app2.get("/api/friends", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json([]);
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import { scrypt as scrypt2, randomBytes as randomBytes2 } from "crypto";
import { promisify as promisify2 } from "util";
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
var scryptAsync2 = promisify2(scrypt2);
async function hashPassword2(password) {
  const salt = randomBytes2(16).toString("hex");
  const buf = await scryptAsync2(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function createSampleUsers() {
  const users2 = await storage.getAllUsers();
  if (users2.length === 0) {
    const sampleUsers = [
      { email: "ashlall@example.com", username: "Ashlall", password: "password", score: 850, wins: 15, losses: 5, winStreak: 3 },
      { email: "sports@example.com", username: "SportsFanatic", password: "password", score: 920, wins: 12, losses: 4, winStreak: 2 },
      { email: "queen@example.com", username: "ChallengeQueen", password: "password", score: 750, wins: 8, losses: 2, winStreak: 5 },
      { email: "jokes@example.com", username: "JokeChallenger", password: "password", score: 580, wins: 5, losses: 3, winStreak: 1 },
      { email: "fitness@example.com", username: "FitnessBaron", password: "password", score: 420, wins: 6, losses: 7, winStreak: 0 }
    ];
    for (const user of sampleUsers) {
      const existingUser = await storage.getUserByUsername(user.username);
      if (!existingUser) {
        const hashedPassword = await hashPassword2(user.password);
        const createdUser = await storage.createUser({
          email: user.email,
          username: user.username,
          password: hashedPassword
        });
        await storage.updateUserScore(createdUser.id, user.score);
        await storage.updateUserWins(createdUser.id, user.wins);
        await storage.updateUserLosses(createdUser.id, user.losses);
        await storage.updateUserWinStreak(createdUser.id, user.winStreak);
        await storage.updateUserMaxWinStreak(createdUser.id, Math.max(user.winStreak, 2));
        await storage.updateUserChallengesCompleted(createdUser.id, user.wins + user.losses);
        console.log(`Created sample user: ${user.username}`);
      }
    }
    const userKing = await storage.getUserByUsername("Ashlall");
    const userSports = await storage.getUserByUsername("SportsFanatic");
    if (userKing && userSports) {
      await storage.createChallenge({
        creatorId: userKing.id,
        title: "FIFA 24 Tournament Challenge",
        description: "Best of 5 games on FIFA 24. Battle for leaderboard dominance!",
        challengeType: "gaming"
      });
      const challenge = await storage.createChallenge({
        creatorId: userSports.id,
        title: "Basketball Skills Contest",
        description: "1-on-1 basketball game to 21 points. Must be recorded for verification.",
        challengeType: "sports"
      });
      if (challenge) {
        await storage.acceptChallenge(challenge.id, userKing.id);
      }
      await storage.createCommunityChallenge({
        title: "Weekly Fitness Challenge",
        description: "Complete 10,000 steps daily for 7 consecutive days",
        type: "fitness",
        points: 500,
        startDate: /* @__PURE__ */ new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3)
        // 7 days from now
      });
      console.log("Created sample challenges");
    }
  }
}
async function createSampleLeagues() {
  const leagues2 = await storage.getLeagues();
  if (leagues2.length === 0) {
    const sampleLeagues = [
      {
        name: "Elite Gamers League",
        description: "A competitive league for serious gamers. Members compete in various gaming challenges for tokens and bragging rights.",
        creatorUsername: "Ashlall"
      },
      {
        name: "Fitness Challengers",
        description: "Push your physical limits with fitness challenges from cardio to strength training. Join a community dedicated to health and improvement.",
        creatorUsername: "FitnessBaron"
      },
      {
        name: "Sports Enthusiasts",
        description: "For those who love traditional sports competition. Create and participate in challenges for basketball, soccer, tennis, and more.",
        creatorUsername: "SportsFanatic"
      },
      {
        name: "Trivia Masters",
        description: "Test your knowledge against the brightest minds. Weekly trivia challenges across history, science, pop culture, and more.",
        creatorUsername: "ChallengeQueen"
      },
      {
        name: "Casual Champions",
        description: "A laid-back league for friendly competition of all types. Perfect for those who enjoy variety and fun over intense competition.",
        creatorUsername: "JokeChallenger"
      }
    ];
    for (const leagueData of sampleLeagues) {
      try {
        const creator = await storage.getUserByUsername(leagueData.creatorUsername);
        if (creator) {
          const league = await storage.createLeague({
            name: leagueData.name,
            description: leagueData.description,
            creatorId: creator.id
          });
          console.log(`Created sample league: ${league.name}`);
          const allUsers = await storage.getAllUsers();
          const potentialMembers = allUsers.filter(
            (user) => user.id !== creator.id && user.username !== "admin"
          );
          const memberCount = Math.floor(Math.random() * 2) + 2;
          for (let i = 0; i < Math.min(memberCount, potentialMembers.length); i++) {
            const randomIndex = Math.floor(Math.random() * potentialMembers.length);
            const member = potentialMembers[randomIndex];
            potentialMembers.splice(randomIndex, 1);
            await storage.addLeagueMember(league.id, member.id);
            console.log(`Added ${member.username} to league ${league.name}`);
          }
        }
      } catch (error) {
        console.error(`Error creating league ${leagueData.name}:`, error);
      }
    }
    console.log("Created sample leagues");
  }
}
async function createSampleFriendships() {
  const ashlall = await storage.getUserByUsername("Ashlall");
  if (!ashlall) return;
  const existingFriends = await storage.getFriends(ashlall.id);
  if (existingFriends.length > 0) return;
  const allUsers = await storage.getAllUsers();
  const otherUsers = allUsers.filter(
    (user) => user.id !== ashlall.id && user.username !== "admin"
  );
  const testUsers = [
    { email: "gamemaster@example.com", username: "GameMaster", password: "password", score: 920, wins: 18, losses: 2 },
    { email: "fitnessguru@example.com", username: "FitnessGuru", password: "password", score: 850, wins: 17, losses: 8 },
    { email: "triviaking@example.com", username: "TriviaKing", password: "password", score: 780, wins: 12, losses: 3 },
    { email: "speedracer@example.com", username: "SpeedRacer", password: "password", score: 690, wins: 14, losses: 6 },
    { email: "chefmaster@example.com", username: "ChefMaster", password: "password", score: 560, wins: 9, losses: 7 },
    { email: "photopro@example.com", username: "PhotoPro", password: "password", score: 430, wins: 6, losses: 4 },
    { email: "musiclover@example.com", username: "MusicLover", password: "password", score: 320, wins: 5, losses: 5 },
    { email: "bookworm@example.com", username: "BookWorm", password: "password", score: 280, wins: 4, losses: 6 },
    { email: "artisticsoul@example.com", username: "ArtisticSoul", password: "password", score: 210, wins: 3, losses: 7 },
    { email: "techwizard@example.com", username: "TechWizard", password: "password", score: 150, wins: 2, losses: 8 }
  ];
  for (const userData of testUsers) {
    const existingUser = await storage.getUserByUsername(userData.username);
    if (!existingUser) {
      const hashedPassword = await hashPassword2(userData.password);
      const createdUser = await storage.createUser({
        email: userData.email,
        username: userData.username,
        password: hashedPassword
      });
      await storage.updateUserScore(createdUser.id, userData.score);
      await storage.updateUserWins(createdUser.id, userData.wins);
      await storage.updateUserLosses(createdUser.id, userData.losses);
      await storage.updateUserWinStreak(createdUser.id, 0);
      await storage.updateUserMaxWinStreak(createdUser.id, userData.wins > 10 ? 5 : 2);
      await storage.updateUserChallengesCompleted(createdUser.id, userData.wins + userData.losses);
      console.log(`Created test user: ${userData.username}`);
    }
  }
  const updatedUsers = await storage.getAllUsers();
  const allOtherUsers = updatedUsers.filter(
    (user) => user.id !== ashlall.id && user.username !== "admin"
  );
  const friendCount = Math.min(10, allOtherUsers.length);
  for (let i = 0; i < friendCount; i++) {
    try {
      await storage.addFriend(ashlall.id, allOtherUsers[i].id);
      await storage.acceptFriendRequest(allOtherUsers[i].id, ashlall.id);
      console.log(`Created friendship between Ashlall and ${allOtherUsers[i].username}`);
    } catch (error) {
      console.error(`Error creating friendship between Ashlall and ${allOtherUsers[i].username}:`, error);
    }
  }
  if (allOtherUsers.length > friendCount) {
    const pendingRequests = Math.min(2, allOtherUsers.length - friendCount);
    for (let i = 0; i < pendingRequests; i++) {
      const friendIndex = friendCount + i;
      try {
        await storage.addFriend(allOtherUsers[friendIndex].id, ashlall.id);
        console.log(`Created friend request from ${allOtherUsers[friendIndex].username} to Ashlall`);
      } catch (error) {
        console.error(`Error creating friend request from ${allOtherUsers[friendIndex].username} to Ashlall:`, error);
      }
    }
  }
  console.log("Created sample friendships");
}
(async () => {
  try {
    console.log("Starting server...");
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      console.error(err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    await createSampleUsers();
    await createSampleLeagues();
    await createSampleFriendships();
    await storage.init();
    const port = 5e3;
    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
})();
