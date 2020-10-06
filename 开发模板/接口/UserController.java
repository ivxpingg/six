package com.ikey.springbootmodule.controller;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.ikey.springbootcommon.shiro.ShiroUser;
import com.ikey.springbootcommon.util.JsonUtil;
import com.ikey.springbootmodule.entity.Signature;
import com.ikey.springbootmodule.entity.User;
import com.ikey.springbootmodule.service.UserService;
import com.ikey.springbootmodule.util.UserUtil;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * @Auther: laughing
 * @Date: 2018-9-12 14:05
 * @Description:  用户
 */
@RestController
@RequestMapping("/user")
public class UserController{

    @Autowired
    private UserService userService;


    /**
     * 查询当前登录用户的信息
     * @return
     */
    @GetMapping("/query")
    public String query(){
        ShiroUser shiroUser = UserUtil.getShiroUser();
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("name",shiroUser.getName());
        jsonObject.put("headPortrait",shiroUser.getHeadPortrait());
        return JsonUtil.getSuccJson(jsonObject);
    }


    /**
     * 根据角色获取人员列表
     * @param page
     * @return
     */
    @PostMapping(value = "userListByRoleType")
    public String userListByRoleType(@RequestBody(required=false) Page<Map<String,Object>> page) {
        if(page==null){
            page = new Page<Map<String,Object>>();
        }
        Page<Map<String,Object>> pageObj = userService.userPageByRoleType(page);
        return JsonUtil.getSuccJson(pageObj);
    }


    /**
     * 人员选择/从业人员管理/监督单位人员管理
     * @return
     */
    @PostMapping(value = "list")
    public String list(@RequestBody(required=false) Page<Map<String,Object>> page){
        if(page==null){
            page = new Page<Map<String,Object>>();
        }
        Page<Map<String,Object>> pageObj = userService.userPage(page);
        return JsonUtil.getSuccJson(pageObj);
    }


    /**
     * 获取用户详情
     * @param userId
     * @return
     */
    @GetMapping(value = "detail")
    public String detail(@RequestParam(name = "userId")String userId){
        return JsonUtil.getSuccJson(userService.detail(userId));
    }


    //添加人员 TODO

    //人员信用评价添加 TODO

    //信用评价列表 TODO

    //人员附件列表 TODO


}
