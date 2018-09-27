package com.ikey.springbootmodule.controller;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.ikey.springbootcommon.shiro.ShiroUser;
import com.ikey.springbootcommon.util.ExceptionType;
import com.ikey.springbootcommon.util.JsonUtil;
import com.ikey.springbootmodule.entity.Menu;
import com.ikey.springbootmodule.exception.GlobalException;
import com.ikey.springbootmodule.service.MenuService;
import com.ikey.springbootmodule.util.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Auther: laughing
 * @Date: 2018-9-12 14:05
 * @Description:  菜单
 */
@RestController
@RequestMapping("/menu")
public class MenuController extends BaseController{

    @Autowired
    private MenuService menuService;

    /**
     * 获取树形菜单
     * @return
     */
    @PostMapping("list")
    public String list(){
        EntityWrapper ew = new EntityWrapper();
        ew.eq("IS_SHOW",1);
        ew.orderBy("sort",true);
        List<Menu> menus = menuService.selectList(ew);
        return JsonUtil.getSuccJson(parentChildrenMenu(menus));
    }

    /**
     * 获取用户菜单
     * @return
     */
    @GetMapping(value = "userMenus")
    public String userMenus(){
        ShiroUser shiroUser = UserUtil.getShiroUser();
        List<Menu> menus = menuService.userMenus(shiroUser.getUserId());
        return JsonUtil.getSuccJson(parentChildrenMenu(menus));
    }


    private List<Menu> parentChildrenMenu(List<Menu> menus){
        Map<String, List<Menu>> map = new HashMap();
        for (Menu menu : menus) {
            List<Menu> parentMenu = map.get(menu.getParentId());
            if (parentMenu == null) {
                parentMenu = new ArrayList();
            }
            parentMenu.add(menu);
            map.put(menu.getParentId(), parentMenu);
        }
        List<Menu> retList = MakeMenu(map, "0");
        return retList;
    }


    private List<Menu> MakeMenu(Map<String, List<Menu>> map, String menuId) {
        List<Menu> menus = new ArrayList();
        List<Menu> menuList = map.get(menuId);
        if (menuList != null) {
            for (Menu me : menuList) {
                me.setChildren(MakeMenu(map, me.getMenuId()));
                menus.add(me);
            }
        }
        return menus;
    }


    /**
     * 增加菜单
     * @param menu
     * @return
     */
    @PostMapping("/add")
    public String add(@RequestBody Menu menu){
        boolean result = menuService.insert(menu);
        if (!result){
            throw new GlobalException(ExceptionType.E0002);
        }
        return JsonUtil.getSuccJson(menu);
    }

    /**
     * 修改
     * @param menu
     * @return
     */
    @PostMapping("/update")
    public String update(@RequestBody Menu menu){
        boolean result = menu.updateById();
        if (!result){
            throw new GlobalException(ExceptionType.E0003);
        }
        return JsonUtil.getSuccJson(menu);
    }

    /**
     * 查询
     * @param menuId
     * @return
     */
    @GetMapping("/query")
    public String query(@RequestParam(required = true)String menuId){
        Menu menu = menuService.selectById(menuId);
        return JsonUtil.getSuccJson(menu);
    }




}
